const express = require("express");
const router = express.Router();
const { getGrade  } = require("../controllers/gradeController");

router.post("/calculate-grade", getGrade);
// router.post("/grading-rules", createGradingRuleHandler);


module.exports = router;