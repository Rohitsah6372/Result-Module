const axios = require("axios");
const prisma = require("../config/prisma");

async function predictStudentPerformance(studentName) {

  const results = await prisma.studentResult.findMany({
    where: { studentName },
    orderBy: { createdAt: "asc" }
  });

  if (!results || results.length < 2) {
    throw new Error("Not enough data to make a prediction");
  }

  const scores = results
    .map(r => r.percentage)
    .filter(score => score !== null);

  const mlHost = process.env.ML_HOST || "127.0.0.1";
  const mlPort = process.env.ML_PORT || 8000;

  try {

    const response = await axios.post(
      `http://${mlHost}:${mlPort}/predict`,
      { scores },
      { timeout: 5000 }
    );

    return response.data;

  } catch (error) {

    console.error("ML service error:", error.message);

    throw new Error("Prediction service unavailable");
  }
}

module.exports = { predictStudentPerformance };