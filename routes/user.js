const path = require('path')

const express = require('express')
const { body } = require('express-validator')

const userController = require('../controllers/user')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/', userController.getIndex)

router.get('/matches', userController.getMatches)

router.get('/matches/:matchId', isAuth, userController.getMatch)

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

router.get('/edit-match/:matchId', isAuth, userController.getEditMatch)
router.post('/edit-match', isAuth,
  [
    body('title', 'Inserisci un nome valido').isString().isLength({ min: 3 }).trim(),
    body('placeName', 'Inserisci un luogo valido').isString().isLength({ min: 3 }).trim(),
    body('address', 'Inserisci un indirizzo valido').isString().isLength({ min: 3 }).trim(),
    body('totalPlayers', 'Inserisci un numero di giocatori valido').isNumeric(),
    body('price', 'Inserisci un prezzo valido').isFloat(),
    body('description', 'Inserisci una descrizione valida').isLength({ min: 5, max: 250 }).trim(),
  ],
  userController.postEditMatch)

router.get('/mymatches', userController.getUserMatches)

router.get('/matches/:matchId/join', isAuth, userController.getJoinMatch)
router.post('/matches/:matchId/join', isAuth, userController.postJoinMatch)

router.get('/matches/:matchId/unjoin', isAuth, userController.getUnJoinMatch)
router.post('/matches/:matchId/unjoin', isAuth, userController.postUnJoinMatch)

router.post('/delete-match', isAuth, userController.postDeleteMatch)

module.exports = router
