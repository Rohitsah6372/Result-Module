const { getStudentTrend, getStudentRisk } = require("./analyticsService");
const { predictStudentPerformance } = require("./mlService");
const prisma = require("../config/prisma");
const redis = require("../config/redis");

// This function generates insights for a student by combining trend analysis, risk assessment, and ML predictions
async function generateStudentInsight(studentName) {

  // First, we check if we have cached insights for this student to improve performance and reduce load on the database and ML service
  const cacheKey = `insight:${studentName}`;
  // If cached data exists, we return it immediately without performing the full analysis again
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const trendData = await getStudentTrend(studentName);
  const riskData = await getStudentRisk(studentName);
  const prediction = await predictStudentPerformance(studentName);

  // We fetch the grading rules for the student's board to determine the predicted grade based on the predicted score
  const result = await prisma.studentResult.findFirst({
    where: { studentName }
  });

  // If we don't have any results for the student, we cannot determine the grading rules, so we set predicted grade to "N/A"
  if (!result) {
    return {
      studentName,
      trend: trendData.trend,
      riskLevel: riskData.riskLevel,
      predictedScore: prediction.predictedScore,
      predictedGrade: "N/A",
      insights: [],
      recommendations: []
    };
  }

  // Fetch grading rules for the student's board to determine the predicted grade based on the predicted score
  const gradingRules = await prisma.gradingRule.findMany({
    where: { boardId: result.boardId }
  });


  // The predicted score from the ML service is used to determine the predicted grade 
  // by comparing it against the grading rules for the student's board.
  const predictedScore = prediction.predictedScore;

  // We find the grading rule that matches the predicted score to assign a predicted grade.
  const gradeRule = gradingRules.find(
    r => predictedScore >= r.minMarks && predictedScore <= r.maxMarks
  );

  // If we find a matching grading rule, we use its grade; otherwise, we set the predicted grade to "N/A"
  const predictedGrade = gradeRule ? gradeRule.grade : "N/A";

  // Based on the trend, risk level, and predicted performance, we generate insights and recommendations for the student.
  const insights = [];
  // We analyze the trend data to provide insights on whether the student's performance is improving or declining.
  const recommendations = [];

  // If the trend is upward, we provide a positive insight; if it's downward, we provide a cautionary insight.
  if (trendData.trend === "UPWARD")
    insights.push("Performance improving consistently");
// If the risk level is high, we provide an insight indicating that the student is at risk academically.
  if (trendData.trend === "DOWNWARD")
    insights.push("Performance declining over recent exams");
// If the predicted score is above a certain threshold, we provide an insight indicating strong projected performance.
  if (riskData.riskLevel === "HIGH")
    insights.push("High academic risk detected");
// Based on the insights, we generate recommendations for the student to help them improve or maintain their performance.
  if (prediction.predictedScore > 85)
    insights.push("Strong projected performance");
// If the risk level is high, we recommend immediate academic intervention to help the student improve their performance.
  if (riskData.riskLevel === "HIGH")
    recommendations.push("Immediate academic intervention required");
// If the trend is downward, we recommend revising weak subject areas to help the student improve their performance.
  if (trendData.trend === "DOWNWARD")
    recommendations.push("Revise weak subject areas");
// If the trend is upward, we recommend maintaining the current study routine to continue the positive performance trajectory.
  if (trendData.trend === "UPWARD")
    recommendations.push("Maintain current study routine");

  const finalResult = {
    studentName,
    trend: trendData.trend,
    riskLevel: riskData.riskLevel,
    predictedScore,
    predictedGrade,
    insights,
    recommendations
  };
  
  // We cache the generated insights for the student to improve performance for subsequent requests, 
  // with an expiration time of 5 minutes (300 seconds).
  await redis.set(cacheKey, JSON.stringify(finalResult), {
    EX: 300
  });

  return finalResult;
}

module.exports = { generateStudentInsight };


