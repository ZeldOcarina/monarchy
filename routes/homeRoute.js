const express = require("express");

const {
  getHomePage,
  getAboutPage,
  getServicesPage,
  getClientsPage,
  getContactsPage,
  postContact,
} = require("../controller/homeController");

const router = express.Router();

router.get("/", getHomePage);
router.get("/about", getAboutPage);
router.get("/service", getServicesPage);
router.get("/clients", getClientsPage);
router.route("/contacts").get(getContactsPage).post(postContact);

module.exports = router;
