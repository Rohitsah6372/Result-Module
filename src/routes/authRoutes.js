const express = require("express");
const router = express.Router();

const { registerHandler, loginHandler } =
  require("../controllers/authController");

router.post("/auth/register", registerHandler);
router.post("/auth/login", loginHandler);

module.exports = router;