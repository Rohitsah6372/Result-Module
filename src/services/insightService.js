const { getStudentTrend } = require("./analyticsService");
const { getStudentRisk } = require("./analyticsService");
const { predictStudentPerformance } = require("./mlService");
const prisma = require("../config/prisma");

async function generateStudentInsight(studentName) {

  const trendData = await getStudentTrend(studentName);
  const riskData = await getStudentRisk(studentName);
  const prediction = await predictStudentPerformance(studentName);

  // Fetch grading rules
  const result = await prisma.studentResult.findFirst({
    where: { studentName }
  });

  const gradingRules = await prisma.gradingRule.findMany({
    where: { boardId: result.boardId }
  });

  const predictedScore = prediction.predictedScore;

  const gradeRule = gradingRules.find(
    r => predictedScore >= r.minMarks && predictedScore <= r.maxMarks
  );

  const predictedGrade = gradeRule ? gradeRule.grade : "N/A";

  const insights = [];
  const recommendations = [];

  if (trendData.trend === "UPWARD")
    insights.push("Performance improving consistently");
  if (trendData.trend === "DOWNWARD")
    insights.push("Performance declining over recent exams");

  if (riskData.riskLevel === "HIGH")
    insights.push("High academic risk detected");

  if (prediction.predictedScore > 85)
    insights.push("Strong projected performance");

  if (riskData.riskLevel === "HIGH")
    recommendations.push("Immediate academic intervention required");

  if (trendData.trend === "DOWNWARD")
    recommendations.push("Revise weak subject areas");

  if (trendData.trend === "UPWARD")
    recommendations.push("Maintain current study routine");

  return {
    studentName,
    trend: trendData.trend,
    riskLevel: riskData.riskLevel,
    predictedScore,
    predictedGrade,
    insights,
    recommendations
  };
}

module.exports = { generateStudentInsight };