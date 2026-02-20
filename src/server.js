const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ClassCrafters Result Module Running 🚀");
});

// Test DB Connection
app.get("/test-db", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: "Database connected successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed ❌" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});