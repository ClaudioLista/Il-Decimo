const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const LoginAttempt = require("../models/loginAttempt");

const maxNumberOfFailedLogins = 5; //on single username
const timeWindowForFailedLogins = 60 * 60 * 1

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "login",
    errorMessage: "",
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getTerms = (req, res, next) => {
  res.render("auth/termsandconditions");
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let errMsg = "Email o Password non validi, riprova ad effettuare il login!";
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "login",
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
          pageTitle: "login",
          errorMessage: errMsg,
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      LoginAttempt.findOne({ usrName: user.usrName }).then((blackList) => {
        if (user.userAttempts >= maxNumberOfFailedLogins && blackList) {
          return res.status(429).render("auth/login", {
            path: "/login",
            pageTitle: "login",
            errorMessage: "Troppi tentativi, riprova tra poco.",
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        } 
        bcrypt
          .compare(password, user.password)
          .then((passOK) => {
            if (passOK && user.activeSessions < 2) {
              user.userAttempts = 0;
              user.activeSessions = user.activeSessions + 1;
              user.save();

              req.session.isLoggedIn = true;
              req.session.user = user;

              const accessToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                {
                  expiresIn: "1d",
                }
              );

              User.findByIdAndUpdate(user._id, { accessToken });
              return req.session.save(() => {
                res.redirect("/");
              });
            }
            const date = new Date();
            LoginAttempt.findOne({usrName: user.usrName}).then((username) => {
              if (!!username) {
                username.save()
              } else {
                const loginAttempt = new LoginAttempt({
                  usrName: user.usrName,
                });
                loginAttempt.save();
              }
            })
            user.userAttempts = user.userAttempts + 1;
            user.save();

            if(user.activeSessions >= 2) {
              errMsg = "Hai già due sessioni attive!"
            }

            return res.status(422).render("auth/login", {
              path: "/login",
              pageTitle: "login",
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

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: "",
    oldInput: {
      usrName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const usrName = req.body.usrName;
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        usrName: usrName,
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        usrName: usrName,
        email: email,
        password: hashedPassword,
        matcheslist: {
          matches: [],
        },
        role: "user",
      });
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      user.accessToken = accessToken;
      //console.log(user)
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    user.activeSessions = user.activeSessions - 1
    user.save()
  }).catch((err) => console.log(err))
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
