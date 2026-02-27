const express = require("express");
const router = express.Router();
const upload = require("../utils/upload")

const { createBoardHandler, uploadBoardCSVHandler } =
  require("../controllers/boardController");

const { authenticate, authorize } =
  require("../middleware/authMiddleware");

// ADMIN only
router.post(
  "/boards",
  authenticate,
  authorize("ADMIN"),
  createBoardHandler
);


router.post(
  "/boards/upload",
  authenticate,
  authorize("ADMIN"),
  upload.single("file"),
  uploadBoardCSVHandler
);


module.exports = router;