const prisma = require("../config/prisma");

async function getExamAnalytics(examId) {
  const results = await prisma.studentResult.findMany({
    where: { examId }
  });

  if (!results.length) {
    throw new Error("No results found for this exam");
  }

  const totalStudents = results.length;

  const percentages = results.map(r => r.percentage);

  const average =
    percentages.reduce((a, b) => a + b, 0) / totalStudents;

  const highest = Math.max(...percentages);
  const lowest = Math.min(...percentages);

  const gradeDistribution = {};
  const riskDistribution = {
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0
  };

  results.forEach(r => {
    gradeDistribution[r.grade] =
      (gradeDistribution[r.grade] || 0) + 1;

    if (r.percentage < 40) {
      riskDistribution.highRisk++;
    } else if (r.percentage <= 60) {
      riskDistribution.mediumRisk++;
    } else {
      riskDistribution.lowRisk++;
    }
  });

  return {
    totalStudents,
    averagePercentage: average.toFixed(2),
    highestPercentage: highest,
    lowestPercentage: lowest,
    gradeDistribution,
    riskDistribution
  };
}


async function getStudentPerformance(studentName) {
  const results = await prisma.studentResult.findMany({
    where: { studentName },
    include: {
      exam: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  if (!results.length) {
    throw new Error("No results found for this student");
  }

  return results.map(r => ({
    exam: r.exam.name,
    percentage: r.percentage,
    grade: r.grade
  }));
}


module.exports = { getExamAnalytics, getStudentPerformance };