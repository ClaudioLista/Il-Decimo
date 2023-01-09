const express = require('express')
const { body } = require('express-validator')
const { Promise, Error } = require('sequelize')

const authController = require('../controllers/auth')
const isAuth = require('../middleware/is-auth')
const User = require('../models/user')

const router = express.Router()

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6, max: 16 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin,
)

router.post(
  '/signup',
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
            return Promise.reject('E-mail già registrata! Se non ricordi la password reimpostala.')
          }
        })
      })
      .normalizeEmail(),
    body('password', 'Perfavore inserisci una password con almeno 6 caratteri!')
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
      }),
  ],
  authController.postSignup,
)

router.post('/logout', isAuth, authController.postLogout)

module.exports = router
