const chatroom = require("../models/chatroom");
const { findOne } = require("../models/match");
const Match = require("../models/match");
const ChatRoom = require("../models/chatroom");
const user = require("../models/user");

exports.getIndex = (req, res, next) => {
  Match.find()
    .then((matches) => {
      res.render("app/index", {
        ms: matches,
        pageTitle: "Home",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getMatches = (req, res, next) => {
  Match.find()
    .then((matches) => {
      res.render("app/match-list", {
        ms: matches,
        pageTitle: "All Matches",
        path: "/matches",
      });
    })
    .catch((err) => console.log(err));
};

//dettaglio del match
exports.getMatch = (req, res, next) => {
  const matchId = req.params.matchId;
  let nameUser = null;
  let playerIn = false;

  user.findById(req.user._id).then((user) => {
     nameUser = user.usrName
     console.log(nameUser)
  }).catch((err) => console.log(err));


  Match.findById(matchId)
    .populate({
      path: "listPlayers.players.userId",
      model: "User",
    })
    .then((match) => {
      if (req.session.isLoggedIn) {
        const risultato = match.listPlayers.players.find(
          (element) => element.userId._id == req.user._id.toString()
        );
        if (risultato !== undefined) {
          playerIn = true;
        }
        const result = match.listPlayers.populate("players.userId");
      }

      ChatRoom.findOne({ matchId: match._id })
        .then((chatroom) => {
          
          messages = chatroom.chat.message;

          
          res.render("app/match-detail", {
            m: match,
            user: nameUser,
            chat: messages,
            pageTitle: match.title,
            path: "/matches",
            is_in: playerIn,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

//render to "Add Match" page
exports.getAddMatch = (req, res, next) => {
  res.render("user/add-match", {
    pageTitle: "Add Match",
    path: "/user/add-match",
    editing: false,
  });
};

//Il controller che gestisce la POST del form Add Match dove
//l'utente può creare un match
exports.postAddMatch = (req, res, next) => {
  //recupero i parametri dalla body della POST
  const title = req.body.title;
  const placeName = req.body.placeName;
  const address = req.body.address;
  const time = req.body.time;
  const price = req.body.price;
  const description = req.body.description;
  const totalPlayers = req.body.totalPlayers;
  const currentPlayers = 0;
  const hostUserId = req.user;

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
  });

  //ora salvo tramite l'operazione match.save offerta da mongoose
  match
    .save()
    .then(() => {
      match.addPlayer(hostUserId);

      
      const chatroom = new ChatRoom({
        matchId: match._id,
        chat: {
          message: [],
        },
      });

      chatroom
        .save()
        .then(() => {
          

        })
        .catch((err) => console.log(err));

      res.redirect("/mymatches");
    })
    .catch((err) => console.log(err));
};

//controller che gestisce la GET per l'update
// di un match indicando l'iD del match
exports.getEditMatch = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const matchId = req.params.matchId;
  Match.findById(matchId)
    .then((match) => {
      if (!match) {
        return res.redirect("/mymatches");
      }
      res.render("user/edit-match", {
        pageTitle: "Edit Match",
        path: "/edit-match",
        editing: editMode,
        match: match,
      });
    })
    .catch((err) => console.log(err));
};

//controller che gestisce la POST per l'update
// di un match indicando l'iD del match
exports.postEditMatch = (req, res, next) => {
  const matchId = req.body.matchId;
  const updatedTitle = req.body.title;
  const updatedPlaceName = req.body.placeName;
  const updatedAddress = req.body.address;
  const updatedTime = req.body.time;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedTotalPlayers = req.body.totalPlayers;

  Match.findById(matchId)
    .then((match) => {
      match.title = updatedTitle;
      match.placeName = updatedPlaceName;
      match.address = updatedAddress;
      if (!!updatedTime) {
        match.time = updatedTime;
      }
      match.price = updatedPrice;
      match.description = updatedDescription;
      match.totalPlayers = updatedTotalPlayers;
      return match.save();
    })
    .then(() => {
      res.redirect("/mymatches");
    })
    .catch((err) => console.log(err));
};

exports.getUserMatches = (req, res, next) => {
  const userId = req.user;
  Match.find({ hostUserId: userId })
    .then((matches) => {
      Match.find({ "listPlayers.players.userId": userId })
        .find({ hostUserId: { $not: { $eq: userId } } })
        .then((joinedMatches) => {
          res.render("user/mymatches", {
            ms: matches,
            jMatches: joinedMatches,
            pageTitle: "My Matches",
            path: "/myatches",
          });
        });
    })
    .catch((err) => console.log(err));
};

//render to "Join Match" page
exports.getJoinMatch = (req, res, next) => {
  const matchId = req.params.matchId;
  let is_in = false;
  Match.findById(matchId)
    .then((match) => {
      const result = match.listPlayers.players.find(
        (element) => element.userId == req.user._id.toString()
      );
      if (result !== undefined) {
        is_in = true;
      }
      res.render("app/join-match", {
        m: match,
        pageTitle: "Join Match",
        path: "/matches/:matchId/join",
        playerIn: is_in,
        editing: true,
      });
    })
    .catch((err) => console.log(err));
};

//aggiunta ad un match gia creato
exports.postJoinMatch = (req, res, next) => {
  const matchId = req.body.matchId;

  const joiningUserId = req.user._id;
  Match.findById(matchId)
    .then((match) => {
      return match.addPlayer(joiningUserId);
    })
    .then(() => {
      res.redirect("/mymatches");
    })
    .catch((err) => console.log(err));
};

exports.postUnJoinMatch = (req, res, next) => {
  const matchId = req.body.matchId;

  const unjoiningUserId = req.user._id;
  Match.findById(matchId)
    .then((match) => {
      return match.RemovePlayer(unjoiningUserId);
    })
    .then(() => {
      res.redirect("/mymatches");
    })
    .catch((err) => console.log(err));
};

exports.getUnJoinMatch = (req, res, next) => {
  const matchId = req.params.matchId;
  let is_in = false;
  let can_unjoin = false;
  let currentDate = new Date();
  Match.findById(matchId)
    .then((match) => {
      const result = match.listPlayers.players.find(
        (element) => element.userId == req.user._id.toString()
      );
      if (result !== undefined) {
        is_in = true;
      }
      let matchDate = new Date(match.time);
      let diffInSec = matchDate / 60000 - currentDate / 60000;

      if (diffInSec > 1440) {
        can_unjoin = true;
      }
      res.render("app/unjoin-match", {
        m: match,
        pageTitle: "Join Match",
        path: "/matches/:matchId/join",
        playerIn: is_in,
        can_unjoin: can_unjoin,
        editing: true,
      });
    })
    .catch((err) => console.log(err));
};

//eliminazione match
exports.postDeleteMatch = (req, res, next) => {
  const matchId = req.body.matchId;
  Match.findByIdAndRemove(matchId)
    .then(() => {
      res.redirect("/mymatches");
    })
    .catch((err) => console.log(err));
};
