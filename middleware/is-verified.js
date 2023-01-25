module.exports = (req, res, next) => {
    if (!req.user.verified) {
      return res.send("Devi prima verificare il tuo account")
    }
    
    next()
  }