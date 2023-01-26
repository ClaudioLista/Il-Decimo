const express = require('express')
const { body } = require('express-validator')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const isLog = require('../middleware/is-logged')
const User = require('../models/user')

const router = express.Router()

router.get("/list",adminController.getList)

module.exports = router