const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be authenticated to proceed");
    return res.redirect("back");
  }
  next();
};

module.exports = isLoggedIn;
