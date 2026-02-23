const csv = require("csv-parser");
const prisma = require("../config/prisma");
const { calculateGrade } = require("./gradeService");

async function processCSV(buffer, examId, examSubjectId) {
  const results = [];
  const rows = [];

  return new Promise((resolve, reject) => {
    const stream = require("stream");
    const readable = new stream.Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    readable
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", async () => {
        try {
          const subject = await prisma.examSubject.findUnique({
            where: { id: examSubjectId }
          });

          const exam = await prisma.exam.findUnique({
            where: { id: examId }
          });

          for (const row of rows) {
            const marks = parseFloat(row.marks);
            const percentage = (marks / subject.maxMarks) * 100;
            const grade = await calculateGrade(exam.boardId, percentage);

            results.push({
              studentName: row.studentName,
              marks,
              percentage,
              grade,
              examId,
              examSubjectId
            });
          }

          await prisma.studentResult.createMany({
            data: results
          });

          resolve({
            totalInserted: results.length
          });

        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

module.exports = { processCSV };