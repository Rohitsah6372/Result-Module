const { createStudentResult } = require("../services/resultService");
const csv = require("csv-parser");
const prisma = require("../config/prisma");
const { Readable } = require("stream");



async function createResultHandler(req, res) {
  try {
    const result = await createStudentResult(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



async function uploadResultCSVHandler(req, res) {
  try {
    const results = [];
    const bufferStream = Readable.from(req.file.buffer);

    bufferStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (const row of results) {
          await prisma.studentResult.create({
            data: {
              studentName: String(row.studentName).trim(),
              marks: parseFloat(row.marks),
              examId: String(req.body.examId).trim(),
              examSubjectId: String(req.body.examSubjectId).trim(),
              percentage: parseFloat(row.marks), 
              grade: "PENDING" 
            }
          });
        }

        res.json({ message: "Results uploaded successfully" });
      });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}




module.exports = { createResultHandler, uploadResultCSVHandler };