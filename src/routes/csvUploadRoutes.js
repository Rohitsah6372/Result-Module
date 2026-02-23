const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const { uploadCSVHandler } = require("../controllers/csvUploadController");
const { authenticate, authorize } = require("../middleware/authMiddleware");



router.post(
  "/results/upload",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  upload.single("file"),
  uploadCSVHandler
);


module.exports = router;