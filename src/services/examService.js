const prisma = require("../config/prisma");

async function createExam(data) {
  const { name, academicYear, boardId } = data;

  const exam = await prisma.exam.create({
    data: {
      name,
      academicYear,
      boardId
    }
  });

  return exam;
}

module.exports = { createExam };