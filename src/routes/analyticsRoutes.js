const express = require("express");
const router = express.Router();

const { getExamAnalyticsHandler, getStudentPerformanceHandler, getStudentTrendHandler } =
  require("../controllers/analyticsController");

router.get("/exams/:examId/analytics", getExamAnalyticsHandler);
router.get("/students/:studentName/performance", getStudentPerformanceHandler);
router.get("/students/:studentName/trend", getStudentTrendHandler);



module.exports = router;