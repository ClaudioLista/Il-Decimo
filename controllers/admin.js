const Match = require("../models/match");
const User = require("../models/user");

const ELEM_PER_PAGE = 3;

exports.getListMatch = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalMatches;
  Match.find()
    .countDocuments()
    .then((numMatches) => {
      totalMatches = numMatches;
      return Match.find()
      .skip((page - 1) * ELEM_PER_PAGE)
      .limit(ELEM_PER_PAGE)
    })   
    .then((matches) => {
      res.render("admin/listMatch", {
        ms: matches,
        pageTitle: "Admin - All Matches",
        path: "/listMatch",
        currentPage: page,
        hasNextPage: ELEM_PER_PAGE * page < totalMatches,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalMatches / ELEM_PER_PAGE)
      });
    })
    .catch((err) => console.log(err));
};

exports.getListUser = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalUsers;
  User.find()
    .countDocuments()
    .then((numUsers) => {
      totalUsers = numUsers;
      return User.find()
      .skip((page - 1) * ELEM_PER_PAGE)
      .limit(ELEM_PER_PAGE)
    })   
    .then((users) => {
      res.render("admin/listUser", {
        us: users,
        pageTitle: "Admin - All Users",
        path: "/listUser",
        currentPage: page,
        hasNextPage: ELEM_PER_PAGE * page < totalUsers,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalUsers / ELEM_PER_PAGE)
      });
    })
    .catch((err) => console.log(err));
};