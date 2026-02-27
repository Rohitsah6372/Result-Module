const { createExam } = require("../services/examService");
const csv = require("csv-parser");
const prisma = require("../config/prisma");
const { Readable } = require("stream");


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


async function uploadExamCSVHandler(req, res) {
  try {
    const results = [];
    const bufferStream = Readable.from(req.file.buffer);

    bufferStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (const row of results) {
          await prisma.exam.create({
            data: {
              name: row.name,
              academicYear: row.academicYear,
              boardId: String(row.boardId)
            }
          });
        }

        res.json({ message: "Exams uploaded successfully" });
      });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }   


}

module.exports = { createExamHandler, uploadExamCSVHandler };