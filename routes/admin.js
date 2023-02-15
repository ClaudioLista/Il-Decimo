const express = require('express');

const adminController = require('../controllers/admin');
const accessController = require('../controllers/accessControl');

const isAuth = require('../middleware/is-auth');
const isVerified = require('../middleware/is-verified');
const isAdmin = require('../middleware/is-admin');
const isEnabled = require('../middleware/is-enabled');

const router = express.Router();

router.get("/listMatch", isAuth, isEnabled, isVerified, isAdmin, accessController.grantAccess("readAny", "matches"), adminController.getListMatch);

router.get("/listUser", isAuth, isEnabled, isVerified, isAdmin, accessController.grantAccess("readAny", "profile"), adminController.getListUser);

router.get('/utente/:username', isAuth, isEnabled, isVerified, isAdmin, accessController.grantAccess("readAny", "matches"), adminController.getUserProfile);

router.get('/editRole/:username', isAuth, isEnabled, isVerified, isAdmin, accessController.grantAccess("updateAny", "role"), adminController.getEditRole);
router.post('/editRole', isAuth, isEnabled, isVerified, isAdmin, accessController.grantAccess("updateAny", "role"), adminController.postEditRole);

router.post('/disattiva-utente', isAuth, isEnabled, isVerified, isAdmin, accessController.grantAccess("updateAny", "profile"), adminController.postDisableUser);
router.post('/attiva-utente', isAuth, isEnabled, isVerified, isAdmin, accessController.grantAccess("updateAny", "profile"), adminController.postEnableUser);

module.exports = router;