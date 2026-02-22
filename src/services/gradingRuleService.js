const prisma = require("../config/prisma");

async function createGradingRule(data) {
  const { boardId, minMarks, maxMarks, grade } = data;

  const rule = await prisma.gradingRule.create({
    data: {
      boardId,
      minMarks: parseFloat(minMarks),
      maxMarks: parseFloat(maxMarks),
      grade
    }
  });

  return rule;
}


async function getGradingRules() {
  const rules = await prisma.gradingRule.findMany({
    orderBy: {
      minMarks: "desc"
    }
  });

  return rules;
}

module.exports = { createGradingRule, getGradingRules };