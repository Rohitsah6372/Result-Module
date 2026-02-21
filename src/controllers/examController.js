const { createExam } = require("../services/examService");

async function createExamHandler(req, res) {
  try {
    const { name, academicYear, boardId } = req.body;

    if (!name || !academicYear || !boardId) {
      return res.status(400).json({
        error: "name, academicYear and boardId are required"
      });
    }

    const exam = await createExam(req.body);

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createExamHandler };