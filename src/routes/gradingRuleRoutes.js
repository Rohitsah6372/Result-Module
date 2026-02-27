const express = require("express");
const router = express.Router();
const { createGradingRuleHandler, getGradingRulesHandler, uploadGradingRuleCSVHandler } = require("../controllers/gradingRuleController");
const upload = require("../utils/upload")



router.post("/grading-rules", createGradingRuleHandler);
router.get("/grading-rules-all", getGradingRulesHandler);
router.post("/grading-rules/upload", upload.single("file"), uploadGradingRuleCSVHandler);

module.exports = router;