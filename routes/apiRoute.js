const express = require("express");

const { upliffsNewCustomer } = require("../controller/apiController");

const router = express.Router();

router.post("/upliffs/new-customer", upliffsNewCustomer);

module.exports = router;
