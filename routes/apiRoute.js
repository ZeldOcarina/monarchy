const express = require("express");

const {
  upliffsNewCustomer,
  calendlyNewEvent,
} = require("../controller/apiController");

const {
  facebookPageVisit,
  facebookLeadEvent,
  facebookShopVisitEvent,
  facebookPurchaseEvent
} = require("../controller/facebookApiController");

const router = express.Router();

router.post("/upliffs/new-customer", upliffsNewCustomer);
router.post("/calendly/new-event", calendlyNewEvent);
router.post("/facebook/page-visit", facebookPageVisit);
router.post("/facebook/lead", facebookLeadEvent);
router.post("/facebook/shop-visit", facebookShopVisitEvent);
router.post("/facebook/purchase", facebookPurchaseEvent);

module.exports = router;
