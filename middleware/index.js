var middlewareObj = {};
var StudentUser = require('../models/studentUser');

middlewareObj.isStudentLoggedin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.isStudent === true) {
        next();
    }
    else {
        req.session.redirectTo = req.originalUrl;
        req.flash("error", "You have to login first");
        res.redirect('/login');
    }
};

module.exports = middlewareObj;