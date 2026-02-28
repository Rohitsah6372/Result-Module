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


async function getStudentTrend(studentName) {
  const results = await prisma.studentResult.findMany({
    where: { studentName },
    orderBy: { createdAt: "asc" }
  });

  if (results.length < 2) {
    throw new Error("Not enough data to calculate trend");
  }

  const percentages = results.map(r => r.percentage);

  const smoothed = [];
  for (let i = 0; i < percentages.length; i++) {
    if (i === 0) {
      smoothed.push(percentages[i]);
    } else {
      smoothed.push((percentages[i] + percentages[i - 1]) / 2);
    }
  }

  const first = smoothed[0];
  const last = smoothed[smoothed.length - 1];
  const slope = last - first;

  let trend = "STABLE";

  if (slope > 5) trend = "UPWARD";
  if (slope < -5) trend = "DOWNWARD";

  return {
    studentName,
    slope,
    trend,
    smoothedPercentages: smoothed
  };
}


async function getStudentRisk(studentName) {
  const results = await prisma.studentResult.findMany({
    where: { studentName },
    orderBy: { createdAt: "asc" }
  });

  if (results.length < 2) {
    throw new Error("Not enough data to calculate risk");
  }

  const percentages = results.map(r => r.percentage);
  const n = percentages.length;

  // Sudden drop detection
  const previous = percentages[n - 2];
  const latest = percentages[n - 1];

  const dropPercent =
    ((previous - latest) / previous) * 100;

  const suddenDrop = dropPercent > 20;

  // Volatility (standard deviation)
  const mean =
    percentages.reduce((a, b) => a + b, 0) / n;

  const variance =
    percentages.reduce(
      (sum, value) => sum + Math.pow(value - mean, 2),
      0
    ) / n;

  const volatility = Math.sqrt(variance);

  // Risk Classification
  let riskLevel = "LOW";

  if (suddenDrop) riskLevel = "HIGH";
  else if (volatility > 15) riskLevel = "MEDIUM";

  return {
    studentName,
    riskLevel,
    suddenDrop,
    volatility: Number(volatility.toFixed(2)),
    dropPercent: Number(dropPercent.toFixed(2))
  };
}



module.exports = { getExamAnalytics, getStudentPerformance, getStudentTrend, getStudentRisk };