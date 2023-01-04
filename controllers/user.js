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
      //console.log('getIndex works')
      //console.log(matches)
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
  const currentPlayers = 1
  const listPlayers = [req.user._id]
  const hostUserId = req.user

  //listPlayers.push(hostUserId)

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
    listPlayers: listPlayers,
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

//controller che gestisce la GET per l'update
// di un match indicando l'iD del match
exports.getEditMatch = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const matchId = req.params.matchId
  Match.findById(matchId)
    .then((match) => {
      if (!match) {
        return res.redirect('/') //torna a my matches
      }
      res.render('/edit-match', {
        pageTitle: 'Edit Match',
        path: '/edit-match',
        editing: editMode,
        match: match,
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => console.log(err))
}

//controller che gestisce la POST per l'update
// di un match indicando l'iD del match
exports.postEditMatch = (req, res, next) => {
  const matchId = req.body.matchId
  const updatedTitle = req.body.title
  const updatedPlaceName = req.body.placeName
  const updatedAddress = req.body.address
  const updatedTime = req.body.time
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description
  const updatedTotalPlayers = req.body.totalPlayers
  //const updatedCurrentPlayers = req.body.totalPlayers

  Match.findById(matchId)
    .then((match) => {
      match.title = updatedTitle
      match.placeName = updatedPlaceName
      match.address = updatedAddress
      match.time = updatedTime
      match.price = updatedPrice
      match.description = updatedDescription
      match.totalPlayers = updatedTotalPlayers
      //match.currentPlayers = updatedCurrentPlayers
      return match.save()
    })
    .then((result) => {
      console.log('Dettagli match modificati!')
      res.redirect('/') // da modificare torna a my matches
    })
    .catch((err) => console.log(err))
}

//eliminazione match
exports.postDeleteMatch = (req, res, next) => {
  const matchId = req.body.matchId
  Match.findByIdAndRemove(matchId)
    .then(() => {
      console.log('Match eliminato')
      res.redirect('/') // da modificare torna a my matches
    })
    .catch((err) => console.log(err))
}
