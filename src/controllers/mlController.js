const { predictStudentPerformance } = require("../services/mlService");

async function predictStudentHandler(req, res) {
  try {

    const { studentName } = req.params;

    if (!studentName) {
      return res.status(400).json({ error: "Student name is required" });
    }

    const prediction = await predictStudentPerformance(studentName);

    res.json(prediction);

  } catch (error) {

    console.error("Prediction error:", error.message);

    res.status(500).json({
      error: error.message || "Prediction failed"
    });

  }
}

module.exports = { predictStudentHandler };