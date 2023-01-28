const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');
const isVerified = require('../middleware/is-verified');
const isAdmin = require('../middleware/is-admin'); //dovrei usare accessController.grantAccess

const router = express.Router();

router.get("/listMatch", isAuth, isVerified, isAdmin, adminController.getListMatch);

router.get("/listUser", isAuth, isVerified, isAdmin, adminController.getListUser);

module.exports = router;