module.exports = (req, res, next) => {
    if (!req.session.user.enabled) {
      return res.send("Il tuo account è stato disabilitato!");
    }
    next()
  };