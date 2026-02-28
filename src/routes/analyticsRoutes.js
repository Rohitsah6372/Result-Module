const express = require("express");
const router = express.Router();

const { getExamAnalyticsHandler, getStudentPerformanceHandler, getStudentTrendHandler, getStudentRiskHandler } =
  require("../controllers/analyticsController");

router.get("/exams/:examId/analytics", getExamAnalyticsHandler);
router.get("/students/:studentName/performance", getStudentPerformanceHandler);
router.get("/students/:studentName/trend", getStudentTrendHandler);
router.get("/students/:studentName/risk", getStudentRiskHandler);


module.exports = router;