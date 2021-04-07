const express = require("express");
const passport = require("passport");

const {
  getLogin,
  registerUser,
  authenticateUser,
  logoutUser,
} = require("../controller/authenticationController");

const router = express.Router();

router
  .route("/login")
  .get(getLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/authentication/login",
      failureMessage: "Incorrect username or password",
    }),
    authenticateUser
  );

//router.get("/register", registerUser);
router.get("/logout", logoutUser);

module.exports = router;
