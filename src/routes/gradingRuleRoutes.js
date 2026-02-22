const express = require("express");
const router = express.Router();
const { createGradingRuleHandler, getGradingRulesHandler } = require("../controllers/gradingRuleController");

router.post("/grading-rules", createGradingRuleHandler);
router.get("/grading-rules-all", getGradingRulesHandler);

module.exports = router;