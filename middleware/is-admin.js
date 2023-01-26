module.exports = (req, res, next) => {
    if (req.user.role != "admin") {
        return res.send("Non hai i permessi per eseguire questa azione")
    }
    next()
}