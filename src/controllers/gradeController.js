const { calculateGrade } = require("../services/gradeService");

async function getGrade(req, res) {
  try {
    const { boardId, marks } = req.body;

    if (!boardId || marks === undefined) {
      return res.status(400).json({
        error: "boardId and marks are required"
      });
    }

    const grade = await calculateGrade(boardId, parseFloat(marks));

    res.json({ grade });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getGrade };