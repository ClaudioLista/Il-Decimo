const express = require('express')
const { body } = require('express-validator')
const { Promise, Error } = require('sequelize')
const bcrypt = require("bcryptjs");
var generatePass = require('password-generator')

const authController = require('../controllers/auth')
const isAuth = require('../middleware/is-auth')
const isLog = require('../middleware/is-logged')
const User = require('../models/user')
const FederateUser = require('../models/federateUser')

const router = express.Router()

var passport = require('passport')
var GoogleStrategy = require('passport-google-oidc')
var FacebookStrategy = require('passport-facebook');
const { rateLimit } = require('../middleware/login-rate-limit');

const passErr= 'Perfavore inserisci una password valida! Deve contenere: almeno 8 caratteri,'+
                ' almeno 1 lettera minuscola, almeno 1 lettera maiuscola, almeno 1 numero e almeno 1 simbolo'

router.get("/verify/:username/:token", authController.getVerify)

router.get('/login', isLog, authController.getLogin)

router.get('/login/federated/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
  })
)

router.get('/login/federated/facebook', passport.authenticate('facebook', {
  scope:['email']
}))

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

router.post('/login', rateLimit, isLog,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8, max: 50 }).trim()
  ],
  authController.postLogin
)

router.get('/terms', authController.getTerms)

router.get('/signup', isLog, authController.getSignup)

router.post('/signup', isLog,
  [
    body('nome', 'Perfavore inserisci il tuo Nome correttamente!')
      .isLength({ min: 1, max: 28 })
      .isString()
      .trim(),
    body('cognome', 'Perfavore inserisci il tuo Cognome correttamente!')
      .isLength({ min: 1, max: 28 })
      .isString()
      .trim(),
    body('usrName', 'Perfavore inserisci un Username con almeno 6 caratteri, composto solo da lettere o numeri!')
      .isLength({ min: 4, max: 60 })
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
              'E-mail già registrata! Se non ricordi la Password reimpostala.',
            )
          }
        })
      })
      .normalizeEmail(),
    body('numCell', 'Perfavore inserisci un Numero telefonico valido!')
      .isLength(10)
      .isMobilePhone(),
    body('password', passErr)
      .isLength({ min: 8, max: 50 })
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      })
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Le Password devono essere uguali!')
        }
        return true
      }),
    body('acceptTerms')
      .custom(input => {
        if (!input) {
          throw new Error('Devi accettare i Termini di servizio spuntando la casella!')
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
                activeSessions: 1
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
              })
              .catch((err) => {
                return cb(err)
              })
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
              })
              .catch((err) => {
                return cb(err)
              })
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