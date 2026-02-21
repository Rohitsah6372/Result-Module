const express = require("express");
const router = express.Router();
const { createExamHandler } = require("../controllers/examController");

router.post("/exams", createExamHandler);

module.exports = router;