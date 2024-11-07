const express = require("express");
const router = express.Router();
const { submitContact } = require("../controllers/Contact");

router.post("/contact", submitContact);

module.exports = router;
