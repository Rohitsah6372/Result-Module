const { predictStudentPerformance } = require("../services/mlService");

async function predictStudentHandler(req, res) {
  try {
    const { studentName } = req.params;
    const prediction = await predictStudentPerformance(studentName);
    res.json(prediction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { predictStudentHandler };