const auth = {}

auth.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error_msg", "No autorizado.");
    res.redirect("/user/login")
}


auth.isAdminAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "Admin"){
        return next();
    }
    req.flash("error_msg", "No autorizado.");
    res.redirect("/user/login")
}

module.exports = auth;