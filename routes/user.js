const path = require('path')

const express = require('express')

const userController = require('../controllers/user')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/', userController.getIndex)

router.get('/matches', userController.getMatches)

router.get('/matches/:matchId', userController.getMatch)

router.get('/add-match', isAuth, userController.getAddMatch)

router.get('/edit-match/:matchId', isAuth, userController.getEditMatch);

router.get('/mymatches', userController.getUserMatches);

router.post('/delete-match', userController.postDeleteMatch);

router.get('/join-match/:matchId', isAuth, userController.getJoinMatch);

router.post('/add-match', isAuth, userController.postAddMatch)

router.post('/edit-match', isAuth, userController.postEditMatch);

router.post('/join-match/:matchId', isAuth, userController.postJoinMatch);

router.post('/delete-match', isAuth, userController.postDeleteMatch);

module.exports = router