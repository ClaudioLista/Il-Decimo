const express = require("express");
const { body } = require("express-validator");
const { Promise, Error } = require("sequelize");

const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");
const setSession = require("../middleware/set-session");
const User = require("../models/user");
const FederateUser = require("../models/federateUser");

const router = express.Router();

var passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");

router.get("/login", authController.getLogin);

router.get("/login/federated/google", passport.authenticate("google"));

router.get("/oauth2/redirect/google", passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "368248899535-vgc9fj94cfkk9sojps8pct6bjgu2d4j0.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile"],
    },
    function verify(issuer, profile, cb) {
      //console.log("IN PASSPORT")
      //console.log(profile)
      FederateUser.findOne({ subject: profile.id, provider: issuer })
        .then((fUser) => {
          if (!fUser) {
            const user = new User({
              usrName: profile.displayName,
              email: profile.email,
              password: null,
              matcheslist: {
                matches: [],
              },
            });
            user
              .save()
              .then(() => {
                console.log(user._id)
                const federateUser = new FederateUser({
                  userId: user._id,
                  provider: issuer,
                  subject: profile.id,
                });
                federateUser.save().then(() => {
                  return cb(null, user);
                });
              })
              .catch((err) => {
                return cb(err);
              });
          } else {
            User.findOne({ _id: fUser.userId }).then((user) => {
              return cb(null, user);
            });
          }
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6, max: 16 }).isAlphanumeric().trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    body(
      "usrName",
      "Perfavore inserisci un username con almeno 6 caratteri, composto solo da lettere o numeri!"
    )
      .isLength({ min: 6, max: 16 })
      .isAlphanumeric()
      .custom((value, { req }) => {
        return User.findOne({ usrName: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Username già utilizzato!");
          }
        });
      }),
    body("email", "Inserisci una E-mail valida!")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail già registrata! Se non ricordi la password reimpostala."
            );
          }
        });
      })
      .normalizeEmail(),
    body("password", "Perfavore inserisci una password con almeno 6 caratteri!")
      .isLength({ min: 6, max: 16 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Le password devono essere uguali!");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.post("/logout", isAuth, authController.postLogout);

module.exports = router;
