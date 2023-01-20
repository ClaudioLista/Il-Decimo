const Match = require("../models/match");
const ChatRoom = require("../models/chatroom");
const user = require("../models/user");
const { validationResult } = require("express-validator");
const { roles } = require('../roles')
 
exports.grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
    
   const permission = roles.can(req.user.role)[action](resource);
   
   if (!permission.granted) {
    return res.status(401).json({
     error: "You don't have enough permission to perform this action"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}
 
exports.allowIfLoggedin = async (req, res, next) => {
 try {
  const user = res.locals.loggedInUser;
  if (!user)
   return res.status(401).json({
    error: "You need to be logged in to access this route"
   });
   req.user = user;
   next();
  } catch (error) {
   next(error);
  }
}




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

exports.getMatch = (req, res, next) => {
  const matchId = req.params.matchId;
  let nameUser = null;
  let playerIn = false;
  let is_full = false;
  let is_over = false;

  if (req.user) {
    user
      .findById(req.user._id)
      .then((user) => { nameUser = user.usrName; })
      .catch((err) => console.log(err));
  }

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
        if(match.currentPlayers==match.totalPlayers) {
          is_full= true
        }
        const today = new Date();
        if (match.time < today) {
          is_over = true;
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
            is_full: is_full,
            isOver: is_over
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getAddMatch = (req, res, next) => {
  res.render("user/add-match", {
    pageTitle: "Add Match",
    path: "/add-match",
    editing: false,
    hasError: false,
    match: null,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddMatch = (req, res, next) => {
  const title = req.body.title;
  const placeName = req.body.placeName;
  const address = req.body.address;
  const time = req.body.time;
  const price = req.body.price;
  const description = req.body.description;
  const totalPlayers = req.body.totalPlayers;
  const currentPlayers = 0;

  const hostUserId = req.user;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render("user/add-match", {
      pageTitle: "Add Match",
      path: "/add-match",
      hasError: true,
      editing: false,
      match: {
        title: title,
        placeName: placeName,
        address: address,
        time: time,
        price: price,
        description: description,
        totalPlayers: totalPlayers
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

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

  match.save()
    .then(() => {
      match.addPlayer(hostUserId);
      const chatroom = new ChatRoom({
        matchId: match._id,
        chat: {
          message: [],
        },
      });
      chatroom.save()
        .then(() => {})
        .catch((err) => console.log(err));
      res.redirect("/mymatches");
    })
    .catch((err) => console.log(err));
};
       
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
        path: "/edit-match/:matchId",
        editing: editMode,
        match: match,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditMatch = (req, res, next) => {
  const matchId = req.body.matchId;
  const updatedTitle = req.body.title;
  const updatedPlaceName = req.body.placeName;
  const updatedAddress = req.body.address;
  const updatedTime = req.body.time;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedTotalPlayers = req.body.totalPlayers;

  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render("user/edit-match", {
      pageTitle: "Edit Match",
      path: "/edit-match",
      hasError: true,
      editing: true,
      match: {
        title: updatedTitle,
        placeName: updatedPlaceName,
        address: updatedAddress,
        time: updatedTime,
        price: updatedPrice,
        description: updatedDescription,
        totalPlayers: updatedTotalPlayers,
        _id: matchId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

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
            path: "/mymatches",
          });
        });
    })
    .catch((err) => console.log(err));
};

exports.getJoinMatch = (req, res, next) => {
  const matchId = req.params.matchId;
  let is_in = false;
  let is_full = false;
  Match.findById(matchId)
    .then((match) => {
      const result = match.listPlayers.players.find(
        (element) => element.userId == req.user._id.toString()
      );
      if (result !== undefined) {
        is_in = true;
      }
      if(match.currentPlayers==match.totalPlayers) {
        is_full= true
      }
      res.render("app/join-match", {
        m: match,
        pageTitle: "Join Match",
        path: "/matches/:matchId/join",
        playerIn: is_in,
        is_full: is_full,
        editing: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.postJoinMatch = (req, res, next) => {
  const matchId = req.body.matchId;
  const joiningUserId = req.user._id;
  Match.findById(matchId)
    .then((match) => {
      if(match.currentPlayers != match.totalPlayers){
      return match.addPlayer(joiningUserId);
      }
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

exports.getUserProfile = (req, res, next) => {
  const userId = req.user;
  user.find({ hostUserId: userId })
    .then((info) => {
      res.render("user/my-profile", {
        pageTitle: "My Profile",
        path: "/myprofile",
        usrName: info.usrName,
        email: info.email,
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteMatch = (req, res, next) => {
  const matchId = req.body.matchId;
  Match.findByIdAndRemove(matchId)
    .then(() => {
      res.redirect("/mymatches");
    })
    .catch((err) => console.log(err));
};
