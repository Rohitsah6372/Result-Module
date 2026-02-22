const express = require("express");
const router = express.Router();
const { createResultHandler } = require("../controllers/resultController");

router.post("/results", createResultHandler);

module.exports = router;