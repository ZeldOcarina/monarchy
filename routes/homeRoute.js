const express = require("express");

const {
  getHomePage,
  getAboutPage,
  getServicesPage,
  getClientsPage,
  getContactsPage,
} = require("../controller/homeController");

const router = express.Router();

router.get("/", getHomePage);
router.get("/about", getAboutPage);
router.get("/service", getServicesPage);
router.get("/clients", getClientsPage);
router.get("/contacts", getContactsPage);

module.exports = router;
