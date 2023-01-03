const { match } = require("assert");
const Match = require("../models/match");

//TO DO
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
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
  const updatedCurrentPlayers = req.body.totalPlayers;
  const updatedHostUserId = req.user; //forse non serve

  Match.findById(matchId)
    .then((match) => {
      match.title = updatedTitle;
      match.placeName = updatedPlaceName;
      match.address = updatedAddress;
      match.time = updatedTime;
      match.price = updatedPrice;
      match.description = updatedDescription;
      match.totalPlayers = updatedTotalPlayers;
      match.currentPlayers = updatedCurrentPlayers;
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED MATCH!");
      res.redirect("/admin/products"); // da modificare
    })
    .catch((err) => console.log(err));
};

//restituisce la lista dei matches all'admin
//(da modificare la parte commentata)
exports.getMatches = (req, res, next) => {
  Match.find()
    .then((matches) => {
      // res.render('admin/products', {
      //   prods: products,
      //   pageTitle: 'Admin Products',
      //   path: '/admin/products'
      // });
    })
    .catch((err) => console.log(err));
};

//eliminazione match
exports.postDeleteMatch = (req, res, next) => {
  const matchId = req.body.matchId;
  Match.findByIdAndRemove(matchId)
    .then(() => {
      console.log("Match eliminato");
      res.redirect("/admin/products"); // da modificare
    })
    .catch((err) => console.log(err));
};
