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

  const response = await axios.post(
    "http://127.0.0.1:8000/predict",
    { scores }
  );

  return response.data;
}

module.exports = { predictStudentPerformance };