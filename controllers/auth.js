const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const LoginAttempt = require("../models/loginAttempt");
const LogSession = require("../models/logSession");
const Token = require("../models/token");
const UserOTPVerification = require("../models/userOTPVerification");

const sendEmail = require("../util/email");
const { OTPVerification } = require('../middleware/send-OTP-verification');

const maxNumberOfFailedLogins = 5; //per signolo account

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: "",
    message: "",
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let errMsg = "Email o Password non validi, riprova ad effettuare il login!";

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errMsg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: errMsg,
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      LoginAttempt.findOne({ usrName: user.usrName }).then((blackList) => {
        if (!!blackList) {
          if (blackList.attempts >= maxNumberOfFailedLogins) {
            return res.status(429).render("auth/login", {
              path: "/login",
              pageTitle: "Login",
              errorMessage: "Troppi tentativi, riprova tra poco.",
              oldInput: {
                email: email,
                password: password,
              },
              validationErrors: [],
            });
          }
        }
        bcrypt
          .compare(password, user.password)
          .then((passOK) => {
            if (passOK && user.activeSessions < 2) {
              if (!user.verified) {
                return res.status(422).render("auth/login", {
                  path: "/login",
                  pageTitle: "Login",
                  errorMessage:
                    "Per effettuare l'accesso devi prima verificare l'email!",
                  oldInput: {
                    email: email,
                    password: password,
                  },
                  validationErrors: [],
                });
              }
              OTPVerification(user._id, user.email, res);
              return res.render("auth/checkOTP", {
                path: "/checkOTP",
                pageTitle: "Check OTP",
                errorMessage: "",
                message: "Abbiamo inviato l'OTP sulla tua email!",
                oldInput: {
                  otp: "",
                },
                email: user.email,
                validationErrors: [],
              });
            }
            LoginAttempt.findOne({ usrName: user.usrName }).then((username) => {
              if (!!username) {
                username.expireAt = Date.now() + 300000;
                username.attempts = username.attempts + 1;
                username.save();
              } else {
                const loginAttempt = new LoginAttempt({
                  usrName: user.usrName,
                  attempts: 1,
                  expireAt: Date.now() + 300000,
                });
                loginAttempt.save();
              }
            });
            if (user.activeSessions >= 2) {
              errMsg = "Hai già due sessioni attive!";
            }
            return res.status(422).render("auth/login", {
              path: "/login",
              pageTitle: "Login",
              errorMessage: errMsg,
              oldInput: {
                email: email,
                password: password,
              },
              validationErrors: [],
            });
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/login");
          });
      });
    })
    .catch((err) => console.log(err));
};

exports.postCheckOTP = (req, res, next) => {
  const email = req.body.email;
  const otp = req.body.otp;
  User.findOne({email: email})
    .then((user) => {
      if (!!user && !!otp) {
        UserOTPVerification.find({ userId: user._id }).then((userOtps) => {
          userOtp = userOtps[userOtps.length - 1]
          
          bcrypt.compare(otp, userOtp.otp).then((otpOK) => {
            if (otpOK) {
              UserOTPVerification.deleteMany({userId: user._id});
              req.session.isLoggedIn = true;
              req.session.user = user;
              var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;    
              const log = new LogSession({ userId: user._id, ipAddress: ip });
              log.save();
              req.session.ipAddress = ip;
              user.lastSession = log.time;
              user.activeSessions = user.activeSessions + 1;
              user.save();
              return req.session.save(() => {
                res.redirect("/?info=true");
              });
            } else {
              return res.render("auth/checkOTP", {
                path: "/checkOTP",
                pageTitle: "Check OTP",
                errorMessage: "OTP non valido",
                message: "",
                oldInput: {
                  otp: otp,
                },
                email: email,
                validationErrors: [],
              });
            }
          });
        }).catch((error)=>{
          console.log(error)
        })
      }
    })
    .catch((error) => console.log(error));
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: "",
    oldInput: {
      nome: "",
      cognome: "",
      usrName: "",
      email: "",
      numCell: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const nome = req.body.nome;
  const cognome = req.body.cognome;
  const usrName = req.body.usrName;
  const email = req.body.email;
  const numCell = req.body.numCell;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        nome: nome,
        cognome: cognome,
        usrName: usrName,
        email: email,
        numCell: numCell,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const Nome = nome.charAt(0).toUpperCase() + nome.slice(1);
      const Cognome = cognome.charAt(0).toUpperCase() + cognome.slice(1);
      const user = new User({
        nome: Nome,
        cognome: Cognome,
        usrName: usrName,
        email: email,
        numCell: numCell,
        password: hashedPassword,
        matcheslist: {
          matches: [],
        },
        role: "user",
        expireAt: Date.now() + 86400000,
      });
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      user.save();
      let token = new Token({
        userId: user._id,
        token: accessToken,
        expireAt: Date.now() + 86400000,
      });
      token.save();

      const message = `${process.env.BASE_URL}/verify/${user.usrName}/${accessToken}`;
      const html =
        "<h2>Clicca il link per confermare l'email:</h2><a href='" + message +
        "' target='_blank'>" + message + "</a>";
      sendEmail(user.email, "Verifica l'email!", html, message);
    })
    .then(() => {
      res.render("auth/login", {
        path: "/login",
        pageTitle: "login",
        errorMessage: null,
        message: "Abbiamo inviato un link per confermare la tua e-mail!",
      });
    })
    .catch((err) => console.log(err));
};

exports.getVerify = (req, res, next) => {
  User.findOne({ usrName: req.params.username }).then((user) => {
    if (!user) {
      return res.status(400).render("auth/emailVerification", {
        path: "/emailVerification",
        pageTitle: "Email Verification",
        valid: false,
      });
    }
    Token.findOne({
      userId: user._id,
      token: req.params.token,
    }).then((token) => {
      if (!token) {
        return res.status(400).render("auth/emailVerification", {
          path: "/emailVerification",
          pageTitle: "Email Verification",
          valid: false,
        });
      }
      user.verified = true;
      user.expireAt = null;
      user.save();
      token.remove();
      return res.status(400).render("auth/emailVerification", {
        path: "/emailVerification",
        pageTitle: "Email Verification",
        valid: true,
      });
    });
  });
};

exports.postLogout = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      user.activeSessions = user.activeSessions - 1;
      user.save();
    })
    .catch((err) => console.log(err));
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
