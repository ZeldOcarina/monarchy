const express = require("express");

const { getBlogHome } = require("../controller/blogController");

const router = express.Router();

router.get("/", getBlogHome);

module.exports = router;
