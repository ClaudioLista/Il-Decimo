const express = require('express');
const { body } = require('express-validator');
const { Promise, Error } = require('sequelize');

const authController = require('../controllers/auth');

const User = require('../models/user');

const isAuth = require('../middleware/is-auth');
const isLog = require('../middleware/is-logged');
const { rateLimit } = require('../middleware/login-rate-limit');

const router = express.Router();

const passErr = 'Perfavore inserisci una password valida! Deve contenere: almeno 8 caratteri,'+
                ' almeno 1 lettera minuscola, almeno 1 lettera maiuscola, almeno 1 numero e almeno 1 simbolo';

router.get('/login', isLog, authController.getLogin)
router.post('/login', rateLimit, isLog,
  [
    body('usrName').isLength({ min: 4, max: 60 }).isAlphanumeric().trim(),
    body('password').isLength({ min: 8, max: 50 }).trim()
  ],
  authController.postLogin
);

router.post('/checkOTP', rateLimit, isLog, authController.postCheckOTP);

router.get('/signup', isLog, authController.getSignup);
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
      })
      .trim(),
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
);

router.get("/verify/:username/:token", isLog, authController.getVerify);

router.post('/logout', isAuth, authController.postLogout);

module.exports = router;