const prisma = require("../config/prisma");

async function calculateGrade(boardId, marks) {
  const rules = await prisma.gradingRule.findMany({
    where: { boardId }
  });

  if (!rules.length) {
    throw new Error("No grading rules found for this board");
  }

  const rule = rules.find(
    (r) => marks >= r.minMarks && marks <= r.maxMarks
  );

  if (!rule) {
    throw new Error("Marks out of grading range");
  }

  return rule.grade;
}

module.exports = { calculateGrade };