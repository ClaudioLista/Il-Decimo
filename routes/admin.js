const express = require('express');

const adminController = require('../controllers/admin');
const accessController = require('../controllers/accessControl');

const isAuth = require('../middleware/is-auth');
const isVerified = require('../middleware/is-verified');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get("/listMatch", isAuth, isVerified, isAdmin, accessController.grantAccess("readAny", "matches"), adminController.getListMatch);

router.get("/listUser", isAuth, isVerified, isAdmin, accessController.grantAccess("readAny", "profile"), adminController.getListUser);

router.get('/utente/:username', isAuth, isVerified, isAdmin, accessController.grantAccess("readAny", "matches"), adminController.getUserProfile);

router.get('/editRole/:username', isAuth, isVerified, isAdmin, accessController.grantAccess("updateAny", "role"), adminController.getEditRole);
router.post('/editRole', isAuth, isVerified, isAdmin, accessController.grantAccess("updateAny", "role"), adminController.postEditRole);

module.exports = router;