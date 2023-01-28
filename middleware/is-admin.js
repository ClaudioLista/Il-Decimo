module.exports = (req, res, next) => {
    if (req.session.user.role != "admin") {
        return res.send("Non hai i permessi per eseguire questa azione");
    }
    next()
};