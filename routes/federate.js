const express = require('express');
const bcrypt = require("bcryptjs");
var generatePass = require('password-generator');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
var FacebookStrategy = require('passport-facebook');

const router = express.Router();

const FederateUser = require('../models/federateUser');
const User = require('../models/user');
const Session = require('../models/session');
const { logger } = require("../util/logger");

router.get('/login/federated/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
  })
);

router.get('/login/federated/facebook', passport.authenticate('facebook', {
  scope:['email']
}));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '368248899535-vgc9fj94cfkk9sojps8pct6bjgu2d4j0.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/oauth2/redirect/google',
      scope: ['profile']
    },
    function verify(issuer, profile, cb) {
      FederateUser.findOne({ subject: profile.id, provider: issuer })
        .then((fUser) => {
          if (!fUser) {
            const pass = generatePass()
            bcrypt.hash(pass, 12)
            .then((hashedPassword) => {
              const user = new User({
                nome: profile.name.givenName,
                cognome: profile.name.familyName,
                usrName: 'g_' + profile.name.givenName + '_' + profile.name.familyName,
                email: profile.emails[0].value,
                password: hashedPassword,
                matcheslist: {
                  matches: []
                },
                verified: true,
              })
              user.save()
              .then(() => {
                const federateUser = new FederateUser({
                  userId: user._id,
                  provider: issuer,
                  subject: profile.id
                })
                federateUser.save().then(() => {
                  return cb(null, user)
                })
                const logInfoMessage = "Utente: "+user._id+" creato con successo dal profilo Google!";
                vault().then((data) => {
                  logger(data.MONGODB_URI_LOG).then((logger) => {
                    logger.info(logMessage + " " + logInfoMessage)
                  });
                })
              })
              .catch((err) => {
                return cb(err)
              })
            })
          } else {
            User.findOne({ _id: fUser.userId }).then((user) => {
              Session.find({'session.user.usrName': user.usrName}).then((activeSessions) => {
                if (activeSessions.length > 2) {
                  const logWarnMessage = "LOGIN FALLITO - Utente: "+user.usrName+" ha troppe sessioni attive!";
                  vault().then((data) => {
                    logger(data.MONGODB_URI_LOG).then((logger) => {
                      logger.warn(logMessage + " " + logWarnMessage)
                    });
                  })
                  return cb(null, null)
                } else {
                  const logInfoMessage = "Utente: "+user.usrName+" - LOGIN EFFETTUATO con Google";
                  vault().then((data) => {
                    logger(data.MONGODB_URI_LOG).then((logger) => {
                      logger.info(logMessage + " " + logInfoMessage);
                    });
                  })
                  return cb(null, user)
                }
              })
            })
          }
        })
        .catch((err) => {
          return cb(err)
        })
    },
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: '846393583262405',
      clientSecret: 'b0bdd9d16238229f41cdd8f7bc5ab6c6',
      callbackURL: '/oauth2/redirect/facebook',
      state: true,
      profileFields: ['id', 'email', 'gender', 'name'],
    },
    function verify(accessToken, refreshToken, profile, cb) {
      FederateUser.findOne({
        subject: profile.id,
        provider: 'https://www.facebook.com'
      })
        .then((fUser) => {
          if (!fUser) {
            const pass = generatePass()
            bcrypt.hash(pass, 12)
            .then((hashedPassword) => {
              const user = new User({
                nome: profile.name.givenName,
                cognome: profile.name.familyName,
                usrName: 'f_' + profile.name.givenName + '_' + profile.name.familyName,
                email: profile.emails[0].value,
                password: hashedPassword,
                matcheslist: {
                  matches: []
                },
                verified: true,
                activeSessions: 1
              })
              user.save()
              .then(() => {
                const federateUser = new FederateUser({
                  userId: user._id,
                  provider: 'https://www.facebook.com',
                  subject: profile.id
                })
                federateUser.save().then(() => {
                  return cb(null, user)
                })
                const logInfoMessage = "Utente: "+user._id+" creato con successo dal profilo Facebook!";
                vault().then((data) => {
                  logger(data.MONGODB_URI_LOG).then((logger) => {
                    logger.info(logMessage + " " + logInfoMessage);
                  });
                })
              })
              .catch((err) => {
                return cb(err)
              })
            })
          } else {
            User.findOne({ _id: fUser.userId }).then((user) => {
              Session.find({'session.user.usrName': user.usrName}).then((activeSessions) => {
                if (activeSessions.length > 2) {
                  const logWarnMessage = "LOGIN FALLITO - Utente: "+user.usrName+" ha troppe sessioni attive!";
                  vault().then((data) => {
                    logger(data.MONGODB_URI_LOG).then((logger) => {
                      logger.warn(logMessage + " " + logWarnMessage);
                    });
                  })
                  return cb(null, null)
                } else {
                  const logInfoMessage = "Utente: "+user.usrName+" - LOGIN EFFETTUATO con Facebook";
                  vault().then((data) => {
                    logger(data.MONGODB_URI_LOG).then((logger) => {
                      logger.info(logMessage + " " + logInfoMessage);
                    });
                  })
                  return cb(null, user)
                }
              })
            })
          }
        })
        .catch((err) => {
          return cb(err)
        })
    },
  )
);

module.exports = router;