require("dotenv").config();

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();



app.use(express.json());

// Import routes
const errorHandler = require("./middleware/errorHandler");
const gradeRoutes = require("./routes/gradeRoutes");
const examRoutes = require("./routes/examRoutes");
const examSubjectRoutes = require("./routes/examSubjectRoutes");
const resultRoutes = require("./routes/resultRoutes");
const gradingRuleRoutes = require("./routes/gradingRuleRoutes");
const csvUploadRoutes = require("./routes/csvUploadRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");
const boardRoutes = require("./routes/boardRoutes");
const mlRoutes = require("./routes/mlRoutes");
const insightRoutes = require("./routes/insightRoutes");




// Mount routes
app.use("/api", gradeRoutes);
app.use("/api", examRoutes);
app.use("/api", examSubjectRoutes);
app.use("/api", resultRoutes);
app.use("/api", gradingRuleRoutes);
app.use("/api", csvUploadRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", authRoutes);
app.use("/api", boardRoutes);
app.use("/api", mlRoutes);
app.use("/api", insightRoutes);



app.get("/", (req, res) => {
  res.send("ClassCrafters Result Module Running ");
});

app.get("/test-db", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: "Database connected successfully " });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed " });
  }
});

const PORT = 5000;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});