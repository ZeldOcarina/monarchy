const express = require("express");

const {
  getHomePage,
  getAboutPage,
  getServicesPage,
} = require("../controller/homeController");

const router = express.Router();

router.get("/", getHomePage);
router.get("/about", getAboutPage);
router.get("/service", getServicesPage);

module.exports = router;
