const express = require("express");
const router = express.Router();

const { getExamAnalyticsHandler, getStudentPerformanceHandler } =
  require("../controllers/analyticsController");

router.get("/exams/:examId/analytics", getExamAnalyticsHandler);
router.get("/students/:studentName/performance", getStudentPerformanceHandler);



module.exports = router;