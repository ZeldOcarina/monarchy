const express = require("express");

const {
  upliffsNewCustomer,
  calendlyNewEvent,
  calendlyAccountEvent,
  getLatestOriginClearPost,
  getRealForRealProducts,
} = require("../controller/apiController");

const {
  facebookPageVisit,
  facebookLeadEvent,
  facebookShopVisitEvent,
  facebookPurchaseEvent,
} = require("../controller/facebookApiController");

const {
  handleGiftCardGeneration,
  handleMinaMellanoCertGeneration,
} = require("../controller/adobeApiController");

const router = express.Router();

router.post("/upliffs/new-customer", upliffsNewCustomer);
router.post("/calendly/new-event", calendlyNewEvent);
//router.post("/calendly/new-event/:account", calendlyAccountEvent);
router.post("/facebook/page-visit", facebookPageVisit);
router.post("/facebook/lead", facebookLeadEvent);
router.post("/facebook/shop-visit", facebookShopVisitEvent);
router.post("/facebook/purchase", facebookPurchaseEvent);
router.post("/adobe/gift-card/", handleGiftCardGeneration);
router.post("/adobe/mina-cert/", handleMinaMellanoCertGeneration);

router.get("/origin-clear/get-latest-post", getLatestOriginClearPost);
router.get("/real-for-real/get-all-products", getRealForRealProducts);

module.exports = router;
