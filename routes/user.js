const path = require('path')

const express = require('express')
const { body } = require('express-validator')

const userController = require('../controllers/user')
const accessController = require('../controllers/accessControl')
const isAuth = require('../middleware/is-auth')
const isVerified = require('../middleware/is-verified')

const router = express.Router()

router.get('/', userController.getIndex)

router.get('/matches', userController.getMatches)

router.get('/matches/:matchId', isAuth, isVerified, accessController.grantAccess("readAny", "matches"), userController.getMatch)

router.get('/add-match', isAuth, userController.getAddMatch)
router.post('/add-match', isAuth,
  [
    body('title', 'Inserisci un nome valido').isString().isLength({ min: 3 }).trim(),
    body('placeName', 'Inserisci un luogo valido').isString().isLength({ min: 3 }).trim(),
    body('address', 'Inserisci un indirizzo valido').isString().isLength({ min: 3 }).trim(),
    body('totalPlayers', 'Inserisci un numero di giocatori valido').isNumeric(),
    body('price', 'Inserisci un prezzo valido').isFloat(),
    body('description', 'Inserisci una descrizione valida').isLength({ min: 5, max: 250 }).trim(),
  ],
  userController.postAddMatch)

router.get('/edit-match/:matchId', isAuth, accessController.grantIfOwnMatch("updateOwn", "matches"), userController.getEditMatch)
router.post('/edit-match', isAuth, accessController.grantIfOwnMatch("updateOwn", "matches"),
  [
    body('title', 'Inserisci un nome valido').isString().isLength({ min: 3 }).trim(),
    body('placeName', 'Inserisci un luogo valido').isString().isLength({ min: 3 }).trim(),
    body('address', 'Inserisci un indirizzo valido').isString().isLength({ min: 3 }).trim(),
    body('totalPlayers', 'Inserisci un numero di giocatori valido').isNumeric(),
    body('price', 'Inserisci un prezzo valido').isFloat(),
    body('description', 'Inserisci una descrizione valida').isLength({ min: 5, max: 250 }).trim(),
  ],
  userController.postEditMatch)

router.post('/vote-match', isAuth, accessController.grantIfIsInMatch("updateOwn","votes"), userController.postVoteMatch)
router.get('/mymatches',isAuth, userController.getUserMatches)

router.get('/matches/:matchId/join', isAuth, accessController.grantAccess("readAny", "matches"), userController.getJoinMatch)
router.post('/matches/:matchId/join', isAuth, accessController.grantAccess("readAny", "matches"), userController.postJoinMatch)

router.get('/matches/:matchId/unjoin', isAuth, accessController.grantIfIsInMatch("updateOwn", "matches"), userController.getUnJoinMatch)
router.post('/matches/:matchId/unjoin', isAuth, accessController.grantIfIsInMatch("updateOwn", "matches"), userController.postUnJoinMatch)

router.get('/profile/:username', isAuth, accessController.grantIfOwnProfile("readOwn", "profile"), userController.getUserProfile)

router.post('/delete-match', isAuth, accessController.grantIfOwnMatch("deleteOwn", "matches"), userController.postDeleteMatch)

module.exports = router
