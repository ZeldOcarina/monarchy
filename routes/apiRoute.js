const express = require("express");

const {
  upliffsNewCustomer,
  calendlyNewEvent,
} = require("../controller/apiController");

const router = express.Router();

router.post("/upliffs/new-customer", upliffsNewCustomer);
router.post("/calendly/new-event", calendlyNewEvent);

module.exports = router;
