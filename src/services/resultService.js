const prisma = require("../config/prisma");
const { calculateGrade } = require("./gradeService");

async function createStudentResult(data) {
  const { studentName, marks, examId, examSubjectId } = data;

  const subject = await prisma.examSubject.findUnique({
    where: { id: examSubjectId }
  });

  if (!subject) {
    throw new Error("Exam subject not found");
  }

  const percentage = (marks / subject.maxMarks) * 100;

  const exam = await prisma.exam.findUnique({
    where: { id: examId }
  });

  const grade = await calculateGrade(exam.boardId, percentage);

  const result = await prisma.studentResult.create({
    data: {
      studentName,
      marks,
      examId,
      examSubjectId,
      percentage,
      grade
    }
  });

  return result;
}

module.exports = { createStudentResult };