const axios = require("axios");
const prisma = require("../config/prisma");

// This function retrieves a student's past performance data and sends it to an ML service for prediction
async function predictStudentPerformance(studentName) {
  // Fetch the student's past results from the database
  const results = await prisma.studentResult.findMany({
    where: { studentName },
    orderBy: { createdAt: "asc" }
  });
  // Ensure we have enough data to make a prediction
  if (!results || results.length < 2) {
    throw new Error("Not enough data to make a prediction");
  }
  // Extract the scores from the results, filtering out any null values which may indicate missing data 
  // This is important to ensure the ML model receives valid input and can make an accurate prediction
  const scores = results
    .map(r => r.percentage)
    .filter(score => score !== null);

  // If after filtering we have no valid scores, we cannot proceed with the prediction
  if (scores.length === 0) {
    throw new Error("No valid scores available for prediction");
  }

  // Define the ML service host and port, allowing for configuration via environment variables
  // This makes it flexible to deploy the ML service separately from the main application, 
  // and allows for easy updates to the service location without changing the code
  const mlHost = process.env.ML_HOST || "127.0.0.1";
  const mlPort = process.env.ML_PORT || 8000;

  try {


    // Send the scores to the ML service for prediction
    // We use a POST request to send the data, and set a timeout to prevent hanging if the service is unresponsive
    // The ML service is expected to return a prediction based on the input scores, which we then return to the caller
    // http://127.0.0.1:8000/predict
    const response = await axios.post(
      `http://${mlHost}:${mlPort}/predict`,
      { scores },
      // Set a timeout to prevent hanging if the service is unresponsive :
      // this is important for maintaining a good user experience and ensuring the application remains responsive
      { timeout: 5000 }
    );

    return response.data;

  } catch (error) {

    console.error("ML service error:", error.message);

    throw new Error("Prediction service unavailable");
  }
}

module.exports = { predictStudentPerformance };