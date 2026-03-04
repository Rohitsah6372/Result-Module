const axios = require("axios");
const prisma = require("../config/prisma");

async function predictStudentPerformance(studentName) {
  const results = await prisma.studentResult.findMany({
    where: { studentName },
    orderBy: { createdAt: "asc" }
  });

  if (results.length < 2) {
    throw new Error("Not enough data to make a prediction");
  }

  const scores = results.map(r => r.percentage);

  const mlHost = process.env.ML_HOST || "127.0.0.1";
  const mlPort = process.env.ML_PORT || 8000;

  const response = await axios.post(
    `http://${mlHost}:${mlPort}/predict`,
    { scores }
  );


  return response.data;
}

module.exports = { predictStudentPerformance };