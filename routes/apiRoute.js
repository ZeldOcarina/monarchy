const express = require("express");

const {
  upliffsNewCustomer,
  calendlyNewEvent,
} = require("../controller/apiController");

const {
  facebookPageVisit,
  facebookLeadEvent,
} = require("../controller/facebookApiController");

const router = express.Router();

router.post("/upliffs/new-customer", upliffsNewCustomer);
router.post("/calendly/new-event", calendlyNewEvent);
router.post("/facebook/page-visit", facebookPageVisit);
router.post("/facebook/lead", facebookLeadEvent);

module.exports = router;
