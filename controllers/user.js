const { findOne } = require('../models/match')
const Match = require('../models/match')

exports.getIndex = (req, res, next) => {
  Match.find()
    .then((matches) => {
      res.render('app/index', {
        ms: matches,
        pageTitle: 'Home',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => console.log(err))
}

exports.getMatches = (req, res, next) => {
  Match.find()
    .then((matches) => {
      res.render('app/match-list', {
        ms: matches,
        pageTitle: 'All Matches',
        path: '/matches',
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => console.log(err))
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
    })
    .catch((err) => console.log(err))
}

//render to "Add Match" page
exports.getAddMatch = (req, res, next) => {
  res.render('user/add-match', {
    pageTitle: 'Add Match',
    path: '/user/add-match',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  })
}

//Il controller che gestisce la POST del form Add Match dove
//l'utente può creare un match
exports.postAddMatch = (req, res, next) => {
  //recupero i parametri dalla body della POST
  const title = req.body.title
  const placeName = req.body.placeName
  const address = req.body.address
  const time = req.body.time
  const price = req.body.price
  const description = req.body.description
  const totalPlayers = req.body.totalPlayers
  const currentPlayers = 0
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
    listPlayers: {
      players: [],
    },
    hostUserId: hostUserId,
  })
  //ora salvo tramite l'operazione match.save offerta da mongoose
  match
    .save()
    .then(() => {
      match.addPlayer(hostUserId)
      res.redirect('/mymatches')
    })
    .catch((err) => console.log(err))
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
      res.render('user/edit-match', {
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

  Match.findById(matchId)
    .then((match) => {
      match.title = updatedTitle
      match.placeName = updatedPlaceName
      match.address = updatedAddress
      if (!!updatedTime) {
        match.time = updatedTime
      }
      match.price = updatedPrice
      match.description = updatedDescription
      match.totalPlayers = updatedTotalPlayers
      return match.save()
    })
    .then(() => {
      res.redirect('/') // da modificare torna a my matches
    })
    .catch((err) => console.log(err))
}

exports.getUserMatches = (req, res, next) => {
  const userId = req.user
  Match.find({ hostUserId: userId })
    .then((matches) => {
      Match.find({"listPlayers.players.userId": userId}).find({"hostUserId": {$not: {$eq: userId}}}).then((joinedMatches) => {
      console.log(joinedMatches);
        res.render('user/mymatches', {
          ms: matches,
          jMatches: joinedMatches,
          pageTitle: 'My Matches',
          path: '/myatches',
          isAuthenticated: req.session.isLoggedIn,
        })
      })
    })
    .catch((err) => console.log(err))
}

//render to "Join Match" page
exports.getJoinMatch = (req, res, next) => {
  const matchId = req.params.matchId
  let is_in = false
  Match.findById(matchId)
    .then((match) => {
      // if (!match) { //match not found
      //   return res.redirect('/') //torna a my matches
      // }
      const result = match.listPlayers.players.find(
        (element) => element.userId == req.user._id.toString(),
      )
      if (result !== undefined) { is_in = true }
      res.render('app/join-match', {
        m: match,
        pageTitle: 'Join Match',
        path: '/matches/:matchId/join',
        playerIn: is_in,
        editing: true,
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => console.log(err))
}

//aggiunta ad un match gia creato
exports.postJoinMatch = (req, res, next) => {
  const matchId = req.body.matchId
  const joiningUserId = req.user._id
  Match.findById(matchId)
    .then((match) => {
      return match.addPlayer(joiningUserId)
    })
    .then(() => {
      res.redirect('/matches')
    })
    .catch((err) => console.log(err))
}

//eliminazione match
exports.postDeleteMatch = (req, res, next) => {
  const matchId = req.body.matchId
  Match.findByIdAndRemove(matchId)
    .then(() => {
      res.redirect('/mymatches')
    })
    .catch((err) => console.log(err))
}
