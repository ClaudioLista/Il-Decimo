const Match = require("../models/match");
const User = require("../models/user");
const { roles } = require("../roles");

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);

      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.grantIfIsInMatch = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      const matchId = req.body.matchId || req.params.matchId;

      User.findById(req.user._id)
        .then((user) => {
          const risultato = user.matchList.find((element) =>
            element.matchId.equals(matchId)
          );
          if (risultato !== undefined) {
            playerIn = true;
          }

          if (
            !permission.granted ||
            (risultato == undefined && !(req.user.role == "admin"))
          ) {
            return res.status(401).json({
              error: "You don't have enough permission to perform this action",
            });
          }
          next();
        })
        .catch((err) => console.log(err));
    } catch (error) {
      next(error);
    }
  };
};

exports.grantIfOwnMatch = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      const matchId = req.body.matchId || req.params.matchId;

      Match.findById(matchId)
        .then((match) => {
          if (!permission.granted || (!match.hostUserId.equals(req.user._id) && !(req.user.role == "admin"))) {
            return res.status(401).json({
              error: "You don't have enough permission to perform this action",
            });
          }
          next();
        })
        .catch((err) => console.log(err));
    } catch (error) {
      next(error);
    }
  };
};

exports.grantIfOwnProfile = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      const username = req.user.usrName;
      User.findOne({ usrName: username })
        .then((user) => {
          if (!permission.granted || (!user._id.equals(req.user._id) && !(req.user.role == "admin"))) {
            return res.status(401).json({
              error: "You don't have enough permission to perform this action",
            });
          }
          next();
        })
        .catch((err) => console.log(err));
    } catch (error) {
      next(error);
    }
  };
};