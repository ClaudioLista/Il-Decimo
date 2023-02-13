const express = require('express');
const { body } = require('express-validator');

const matchController = require('../controllers/match');
const accessController = require('../controllers/accessControl');

const isAuth = require('../middleware/is-auth');
const isVerified = require('../middleware/is-verified');

const router = express.Router();

router.get('/matches', matchController.getMatches);

router.get('/matches/:matchId', isAuth, isVerified, accessController.grantAccess("readAny", "matches"), matchController.getMatch);

router.get('/add-match', isAuth, isVerified, matchController.getAddMatch);
router.post('/add-match', isAuth, isVerified,
  [
    body('title', 'Inserisci un nome valido').isString().isLength({ min: 3 }).trim(),
    body('placeName', 'Inserisci un luogo valido').isString().isLength({ min: 3 }).trim(),
    body('address', 'Inserisci un indirizzo valido').isString().isLength({ min: 3 }).trim(),
    body('totalPlayers', 'Inserisci un numero di giocatori valido').isNumeric().escape(),
    body('price', 'Inserisci un prezzo valido').isFloat().escape(),
    body('description', 'Inserisci una descrizione valida').isLength({ min: 5, max: 250 }).trim(),
  ],
  matchController.postAddMatch
);

router.get('/edit-match/:matchId', isAuth, isVerified, accessController.grantIfOwnMatch("updateOwn", "matches"), matchController.getEditMatch);
router.post('/edit-match', isAuth, isVerified, accessController.grantIfOwnMatch("updateOwn", "matches"),
  [
    body('title', 'Inserisci un nome valido').isString().isLength({ min: 3 }).trim(),
    body('placeName', 'Inserisci un luogo valido').isString().isLength({ min: 3 }).trim(),
    body('address', 'Inserisci un indirizzo valido').isString().isLength({ min: 3 }).trim(),
    body('totalPlayers', 'Inserisci un numero di giocatori valido').isNumeric().escape(),
    body('price', 'Inserisci un prezzo valido').isFloat().escape(),
    body('description', 'Inserisci una descrizione valida').isLength({ min: 5, max: 250 }).trim(),
  ],
  matchController.postEditMatch
);

router.get('/mymatches', isAuth, isVerified, matchController.getUserMatches);

router.get('/matches/:matchId/join', isAuth, isVerified, accessController.grantAccess("readAny", "matches"), matchController.getJoinMatch);
router.post('/matches/:matchId/join', isAuth, isVerified, accessController.grantAccess("readAny", "matches"), matchController.postJoinMatch);

router.get('/matches/:matchId/unjoin', isAuth, isVerified, accessController.grantIfIsInMatch("updateOwn", "matches"), matchController.getUnJoinMatch);
router.post('/matches/:matchId/unjoin', isAuth, isVerified, accessController.grantIfIsInMatch("updateOwn", "matches"), matchController.postUnJoinMatch);

router.post('/vote-match', isAuth, isVerified, accessController.grantIfIsInMatch("updateOwn","votes"), matchController.postVoteMatch);

router.post('/delete-match', isAuth, isVerified, accessController.grantIfOwnMatch("deleteOwn", "matches"), matchController.postDeleteMatch);

module.exports = router; 