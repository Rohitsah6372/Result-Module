const { getExamAnalytics, getStudentPerformance } = require("../services/analyticsService");

async function getExamAnalyticsHandler(req, res) {
  try {
    const { examId } = req.params;

    if (!examId) {
      return res.status(400).json({
        error: "examId is required"
      });
    }

    const analytics = await getExamAnalytics(examId);

    res.json(analytics);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



async function getStudentPerformanceHandler(req, res) {
  try {
    const { studentName } = req.params;

    const data = await getStudentPerformance(studentName);

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getExamAnalyticsHandler , getStudentPerformanceHandler };