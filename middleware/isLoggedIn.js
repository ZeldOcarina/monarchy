const isLoggedIn = (req, res, next) => {
  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      req.flash("error", "You must be authenticated to proceed");
      return res.redirect("/blog");
    }
    next();
  };
};

module.exports = isLoggedIn;
