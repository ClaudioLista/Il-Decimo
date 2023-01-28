module.exports = (req, res, next) => {
  if (!req.session.user.verified) {
    return res.send("Devi prima verificare il tuo account!");
  }
  next()
};