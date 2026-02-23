const express = require("express");
const router = express.Router();

const { createBoardHandler } =
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

module.exports = router;