const prisma = require("../config/prisma");

async function createBoard(data) {
  const { name, academicYear } = data;

  return await prisma.board.create({
    data: { name, academicYear }
  });
}

module.exports = { createBoard };