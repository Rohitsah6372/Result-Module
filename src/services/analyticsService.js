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
    // Grade distribution
    gradeDistribution[r.grade] =
      (gradeDistribution[r.grade] || 0) + 1;


    // Risk classification based on percentage
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


// Simple trend analysis using smoothed percentages and slope calculation
  async function getStudentTrend(studentName) {
  // Fetch all results for the student, ordered by date
  const results = await prisma.studentResult.findMany({
    where: { studentName },
    orderBy: { createdAt: "asc" }
  });

  if (results.length < 2) {
    throw new Error("Not enough data to calculate trend");
  }

  // Extract percentages for trend analysis
  const percentages = results.map(r => r.percentage);

  /*
    Simple moving average smoothing
    This part of the code is smoothing the student’s marks so 
    that sudden jumps in scores look more stable and easier to analyze. 
  */
  const smoothed = [];
  // For the first data point, just take it as is. For subsequent points, average with the previous one.
  for (let i = 0; i < percentages.length; i++) {
    if (i === 0) {
      // For the first point, we don't have a previous point to average with, so we just take it as is.
      smoothed.push(percentages[i]);
    } else {
      // Average the current percentage with the previous one to smooth out short-term fluctuations
      smoothed.push((percentages[i] + percentages[i - 1]) / 2);
    }
  }

  // Calculate slope (trend) using the first and last smoothed values
  const first = smoothed[0];
  // Slope = (y2 - y1) / (x2 - x1), here x is time (index), so it simplifies to y2 - y1
  const last = smoothed[smoothed.length - 1];
  // Slope is the change in percentage over the time period
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


// Risk classification based on sudden drops and volatility
async function getStudentRisk(studentName) {
  // Fetch all results for the student, ordered by date
  const results = await prisma.studentResult.findMany({
    where: { studentName },
    orderBy: { createdAt: "asc" }
  });

  if (results.length < 2) {
    throw new Error("Not enough data to calculate risk");
  }

  // Extract percentages for risk analysis
  const percentages = results.map(r => r.percentage);
  // Get the number of results to analyze the latest two for sudden drop and all for volatility
  const n = percentages.length;

  /*
    Sudden drop detection: Compare the latest percentage with the previous one
    This part of the code checks whether the student's latest exam score dropped sharply compared to the previous exam.
  */

  /*
  Getting the previous percentage to compare against the latest one. 
  We need at least two results to do this comparison, 
  which is why we check for length < 2 at the beginning of the function.
  */
  const previous = percentages[n - 2];
  
  // Latest percentage to compare against the previous one
  const latest = percentages[n - 1];

  // Calculate the percentage drop from the previous to the latest result
  /*
          (previous score ? latest score)
          ------------------------------ × 100
                  previous score
  */
  const dropPercent =
    ((previous - latest) / previous) * 100;


// A sudden drop is defined as a drop of more than 20% from the previous result.
  const suddenDrop = dropPercent > 20;



  /* 
    this part of the code calculates how much the student’s marks fluctuate. 
    In statistics this is called variance and standard deviation, 
    which measure how spread out the scores are.
  */

  // Volatility (standard deviation) is calculated as the square root of the average of the squared differences from the mean.
  // adds all  percentage toget the total and then divides by n to get the average (mean) percentage.
  const mean =
    percentages.reduce((a, b) => a + b, 0) / n;

  // Variance is calculated as the average of the squared differences from the mean.
  /*
    For every score:
    1. Subtract the mean
    2. Square the result
    3. Add them together
    4. Divide by number of exams
    This measures how far each score is from the average.
  */
  const variance =
    percentages.reduce(
      (sum, value) => sum + Math.pow(value - mean, 2),
      0
    ) / n;

  // Volatility is the square root of the variance, giving us a measure of how much the student's performance fluctuates over time.
  /*
    This calculation tells you:
      Low volatility ? student scores are consistent
      High volatility ? student scores go up and down a lot
  */
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