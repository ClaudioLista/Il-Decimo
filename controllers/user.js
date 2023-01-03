const { match } = require('assert');
const Match = require('../models/match');

exports.getMatches = (req, res, next) => {
  Match.find()
    .then(matches => {
      console.log('GetMatches Works',matches);
      // res.render('shop/product-list', {
      //   prods: products,
      //   pageTitle: 'All Products',
      //   path: '/products'
      // });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getMatch = (req, res, next) => {
  const matchId = req.params.matchId;
  Match.findById(matchId)
    .then(match => {
      // res.render('shop/product-detail', {
      //   product: product,
      //   pageTitle: product.title,
      //   path: '/products'
      // });

      console.log('getSingleMatch works',match);
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Match.find()
    .then(matches => {
      // res.render('shop/index', {
      //   prods: products,
      //   pageTitle: 'Shop',
      //   path: '/'
      // });
      console.log('getIndex works');
      console.log(matches);
    })
    .catch(err => {
      console.log(err);
    });
};

