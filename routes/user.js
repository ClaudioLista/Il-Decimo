const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/', userController.getIndex);

router.get('/matches', userController.getMatches);

router.get('/matches/:matchId', userController.getMatch);

// /user/add-match => GET
router.get('/add-match', userController.getAddMatch);

// /user/add-match => POST
router.post('/add-match', userController.postAddMatch);

// router.get('/edit-product/:productId', adminController.getEditProduct);

// router.post('/edit-product', adminController.postEditProduct);

// router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
