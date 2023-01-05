const path = require('path')

const express = require('express')

const userController = require('../controllers/user')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/', userController.getIndex)

router.get('/matches', userController.getMatches)

router.get('/matches/:matchId', userController.getMatch)

router.get('/add-match', isAuth, userController.getAddMatch)

router.post('/add-match', isAuth, userController.postAddMatch)

router.get('/edit-match/:matchId', isAuth, userController.getEditMatch)

router.post('/edit-match', isAuth, userController.postEditMatch)

router.get('/mymatches', userController.getUserMatches)

router.get('/matches/:matchId/join', isAuth, userController.getJoinMatch)
router.post('/matches/:matchId/join', isAuth, userController.postJoinMatch)

router.get('/matches/:matchId/unjoin', isAuth, userController.getUnJoinMatch)
router.post('/matches/:matchId/unjoin', isAuth, userController.postUnJoinMatch)

router.post('/delete-match', isAuth, userController.postDeleteMatch)

module.exports = router
