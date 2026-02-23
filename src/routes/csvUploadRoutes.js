const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const { uploadCSVHandler } = require("../controllers/csvUploadController");

router.post("/results/upload", upload.single("file"), uploadCSVHandler);

module.exports = router;