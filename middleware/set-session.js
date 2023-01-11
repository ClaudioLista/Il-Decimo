module.exports = (req, res, next) => {
    console.log("SET SESSION")
  req.session.isLoggedIn = true;
  //req.session.user = user;
  return req.session.save(() => {
    console.log("Login effettuato con successo");
    res.redirect("/");
  });
  next()
};
