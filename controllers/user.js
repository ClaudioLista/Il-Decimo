//const { match } = require('assert');
const Match = require('../models/match')

exports.getMatches = (req, res, next) => {
  Match.find()
    .then((matches) => {
      console.log('GetMatches Works', matches)
      res.render('app/match-list', {
        ms: matches,
        pageTitle: 'All Matches',
        path: '/matches',
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getMatch = (req, res, next) => {
  const matchId = req.params.matchId
  Match.findById(matchId)
    .then((match) => {
      res.render('app/match-detail', {
        m: match,
        pageTitle: match.title,
        path: '/matches',
        isAuthenticated: req.session.isLoggedIn,
      })

      console.log('getSingleMatch works', match)
    })
    .catch((err) => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Match.find()
    .then((matches) => {
      res.render('app/index', {
        ms: matches,
        pageTitle: 'Home',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
      })
      console.log('getIndex works')
      console.log(matches)
    })
    .catch((err) => {
      console.log(err)
    })
}

//render to "Add Match" page
exports.getAddMatch = (req, res, next) => {
  res.render('user/add-match', {
    pageTitle: 'Add Match',
    path: '/user/add-match',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  })
  console.log('getAddMatch')
}

//Il controller che gestisce la POST del form Add Match dove
//l'utente può creare un match
exports.postAddMatch = (req, res, next) => {
  //console.log(req);
  //recupero i parametri dalla body della POST
  const title = req.body.title
  const placeName = req.body.placeName
  const address = req.body.address
  const time = req.body.time
  const price = req.body.price
  const description = req.body.description
  const totalPlayers = req.body.totalPlayers
  const currentPlayers = req.body.totalPlayers
  const hostUserId = req.user

  //creo nuovo oggetto Match coi nuovi parametri
  const match = new Match({
    title: title,
    placeName: placeName,
    address: address,
    time: time,
    price: price,
    description: description,
    totalPlayers: totalPlayers,
    currentPlayers: currentPlayers,
    hostUserId: hostUserId,
  })
  //ora salvo tramite l'operazione match.save offerta da mongoose
  match
    .save()
    .then((result) => {
      // console.log(result);
      console.log('Created Match')
      res.redirect('/') //da modificare
    })
    .catch((err) => {
      console.log(err)
    })
}
