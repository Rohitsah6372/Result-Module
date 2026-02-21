const { createExamSubject } = require("../services/examSubjectService");

async function createExamSubjectHandler(req, res) {
  try {
    const { subjectName, maxMarks, internalMarks, externalMarks, examId } = req.body;

    if (!subjectName || !maxMarks || !examId) {
      return res.status(400).json({
        error: "subjectName, maxMarks and examId are required"
      });
    }

    const subject = await createExamSubject({
      subjectName,
      maxMarks: parseInt(maxMarks),
      internalMarks: parseInt(internalMarks || 0),
      externalMarks: parseInt(externalMarks || 0),
      examId
    });

    res.status(201).json(subject);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createExamSubjectHandler };