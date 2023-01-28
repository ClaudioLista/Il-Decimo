module.exports = (req, res, next) => {
  if (req.session.isLoggedIn == true) {
    return res.redirect('/');
  }
  next()
};