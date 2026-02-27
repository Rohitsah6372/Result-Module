const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");


const { createResultHandler, uploadResultCSVHandler } = require("../controllers/resultController");

router.post("/results", createResultHandler);
router.post("/results/upload", upload.single("file"), uploadResultCSVHandler);

module.exports = router;