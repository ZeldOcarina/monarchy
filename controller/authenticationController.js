const User = require("../models/users");

exports.registerUser = async (req, res) => {
  const user = new User({ email: "micaela@monarchy.io", username: "Micaela" });
  const newUser = await User.register(user, "5YGrH5937ej@CMTF");
  res.status(201).send(newUser);
};

exports.getLogin = (req, res) => {
  res.status(200).render("login");
};

exports.authenticateUser = (req, res) => {
  req.flash("success", "Welcome back, " + req.user.username);
  res.status(200).redirect("/blog");
};

exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "You have been correctly logged out.");
  res.status(200).redirect("/blog");
};
