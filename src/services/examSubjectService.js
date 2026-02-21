const prisma = require("../config/prisma");

async function createExamSubject(data) {
  const subject = await prisma.examSubject.create({
    data
  });

  return subject;
}

module.exports = { createExamSubject };