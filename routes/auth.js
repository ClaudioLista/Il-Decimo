const express = require('express')
const { body } = require('express-validator')
const { Promise, Error } = require('sequelize')

const authController = require('../controllers/auth')
const isAuth = require('../middleware/is-auth')
const isLog = require('../middleware/is-logged')
const User = require('../models/user')
const FederateUser = require('../models/federateUser')

const router = express.Router()

var passport = require('passport')
var GoogleStrategy = require('passport-google-oidc')
var FacebookStrategy = require('passport-facebook')

router.get('/login', isLog, authController.getLogin)

router.get('/https://ildecimo.it/login/federated/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ], 
  })
)

router.get('https://ildecimo.it/login/federated/facebook', passport.authenticate('facebook', {
  scope:['email']
}))

router.get('https://ildecimo.it/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

router.get('https://ildecimo.it/oauth2/redirect/facebook', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

router.post('/login', isLog,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6, max: 16 }).isAlphanumeric().trim() // TODO : modificare il controllo password
  ],
  authController.postLogin
)

router.get('/signup', isLog, authController.getSignup)

router.post('/signup', isLog,
  [
    body('usrName', 'Perfavore inserisci un username con almeno 6 caratteri, composto solo da lettere o numeri!')
      .isLength({ min: 6, max: 16 })
      .isAlphanumeric()
      .custom((value, { req }) => {
        return User.findOne({ usrName: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Username già utilizzato!')
          }
        })
      }),
    body('email', 'Inserisci una E-mail valida!')
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              'E-mail già registrata! Se non ricordi la password reimpostala.',
            )
          }
        })
      })
      .normalizeEmail(),
    body('password', 'Perfavore inserisci una password con almeno 6 caratteri!')    // TODO : modificare il controllo password
      .isLength({ min: 6, max: 16 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Le password devono essere uguali!')
        }
        return true
      })
  ],
  authController.postSignup
)

router.post('/logout', isAuth, authController.postLogout)

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '368248899535-vgc9fj94cfkk9sojps8pct6bjgu2d4j0.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'https://ildecimo.it/oauth2/redirect/google',
      scope: ['profile']
    },
    function verify(issuer, profile, cb) {
      FederateUser.findOne({ subject: profile.id, provider: issuer })
        .then((fUser) => {
          if (!fUser) {
            const user = new User({
              usrName: profile.displayName,
              email: profile.emails[0].value,
              password: null,
              matcheslist: {
                matches: []
              }
            })
            user
              .save()
              .then(() => {
                const federateUser = new FederateUser({
                  userId: user._id,
                  provider: issuer,
                  subject: profile.id
                })
                federateUser.save().then(() => {
                  return cb(null, user)
                })
              })
              .catch((err) => {
                return cb(err)
              })
          } else {
            User.findOne({ _id: fUser.userId }).then((user) => {
              return cb(null, user)
            })
          }
        })
        .catch((err) => {
          return cb(err)
        })
    },
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: '846393583262405',
      clientSecret: 'b0bdd9d16238229f41cdd8f7bc5ab6c6',
      callbackURL: 'https://ildecimo.it/oauth2/redirect/facebook',
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
            const user = new User({
              usrName: profile.displayName,
              email: profile.emails[0].value,
              password: null,
              matcheslist: {
                matches: []
              }
            })
            user
              .save()
              .then(() => {
                const federateUser = new FederateUser({
                  userId: user._id,
                  provider: 'https://www.facebook.com',
                  subject: profile.id
                })
                federateUser.save().then(() => {
                  return cb(null, user)
                })
              })
              .catch((err) => {
                return cb(err)
              })
          } else {
            User.findOne({ _id: fUser.userId }).then((user) => {
              return cb(null, user)
            })
          }
        })
        .catch((err) => {
          return cb(err)
        })
    },
  )
)

module.exports = router