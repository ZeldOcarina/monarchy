const express = require("express");

const { getHomePage, getAboutPage } = require("../controller/homeController");

const router = express.Router();

router.get("/", getHomePage);
router.get("/about", getAboutPage);

module.exports = router;
