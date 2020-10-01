const express = require("express");

const {
  getHomePage,
  getAboutPage,
  getServicesPage,
  getClientsPage,
} = require("../controller/homeController");

const router = express.Router();

router.get("/", getHomePage);
router.get("/about", getAboutPage);
router.get("/service", getServicesPage);
router.get("/clients", getClientsPage);

module.exports = router;
