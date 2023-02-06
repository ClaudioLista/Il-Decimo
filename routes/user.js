const express = require('express');
const { body } = require('express-validator');
const { Promise, Error } = require('sequelize');

const userController = require('../controllers/user');
const accessController = require('../controllers/accessControl');

const User = require('../models/user');

const isAuth = require('../middleware/is-auth');
const isVerified = require('../middleware/is-verified');

const router = express.Router();

router.get('/', userController.getIndex);

router.get('/terms', userController.getTerms);

router.get('/myprofile', isAuth, isVerified, accessController.grantIfOwnProfile("readOwn", "profile"), userController.getUserProfile);

router.get('/editUser/:username', isAuth, isVerified, accessController.grantIfOwnProfile("updateOwn", "profile"), userController.getEditUser);
router.post('/editUser', isAuth, isVerified, accessController.grantIfOwnProfile("updateOwn", "profile"),
  [
    body('usrName', 'Perfavore inserisci un Username con almeno 6 caratteri, composto solo da lettere o numeri!')
      .isLength({ min: 4, max: 60 })
      .custom((value, { req }) => {
        if(value == req.body.userName) {
            return true
        } else {
            return User.findOne({ usrName: value }).then((userDoc) => {
            if (userDoc) {
                return Promise.reject('Username già utilizzato!')
            }
            })
        }
      })
      .trim()
      .escape(),
    body('nome', 'Perfavore inserisci il tuo Nome correttamente!')
      .isLength({ min: 1, max: 28 })
      .isString()
      .trim()
      .escape(),
    body('cognome', 'Perfavore inserisci il tuo Cognome correttamente!')
      .isLength({ min: 1, max: 28 })
      .isString()
      .trim()
      .escape(),
    body('numTel', 'Perfavore inserisci un Numero telefonico valido, o non inserirlo')
      .trim()
      .custom((value) => {
        if (!value) {
            return true
        } else if (value.length == 10) {
            return true
        } else {
            throw new Error('Perfavore inserisci un Numero telefonico valido, o non inserirlo')
        }
      })
      .escape(),
    body('age', 'Inserisci un età valida, o non inserirla').trim().escape(),
    body('city', 'Inserisci una città valida, o non inserirla').trim().escape(),
    body('state', 'Inserisci una nazione valida, o non inserirla').trim().escape(),
    body('squad', 'Inserisci una squadra valida, o non inserirla').trim().escape(),
    body('bio', 'Inserisci una bio valita, o non inserirla').trim().escape(),
  ], 
  userController.postEditUser
);

module.exports = router; 