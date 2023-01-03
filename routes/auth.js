const express = require('express')

const authController = require('../controllers/auth')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.post('/login', authController.postLogin)

router.post('/signup', authController.postSignup)

router.post('/logout', isAuth, authController.postLogout)

module.exports = router
