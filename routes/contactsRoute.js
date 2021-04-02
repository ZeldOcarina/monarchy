const express = require("express");

const {
  getContactsPage,
  checkRecaptcha,
  organizeFormData,
  sendEmail,
  postContact,
  postToSalesJet,
  saveContact,
  redirectToPage,
} = require("../controller/contactsController");

const router = express.Router();

router
  .route("/")
  .get(getContactsPage)
  .post(
    checkRecaptcha,
    organizeFormData,
    postContact,
    postToSalesJet,
    sendEmail,
    redirectToPage
  );
router
  .route("/newsletter-subscription")
  .post(
    checkRecaptcha,
    organizeFormData,
    postToSalesJet,
    postContact,
    redirectToPage
  );

module.exports = router;
