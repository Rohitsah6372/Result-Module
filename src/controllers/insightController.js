const { generateStudentInsight } = require("../services/insightService");

async function getStudentInsightHandler(req, res) {
  try {
    const { studentName } = req.params;
    const insight = await generateStudentInsight(studentName);
    res.json(insight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { getStudentInsightHandler };