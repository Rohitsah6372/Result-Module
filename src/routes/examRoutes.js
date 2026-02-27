const express = require("express");
const router = express.Router();
const upload = require("../utils/upload")


const { createExamHandler, uploadExamCSVHandler } = require("../controllers/examController");

router.post("/exams", createExamHandler);
router.post("/exams/upload", upload.single("csvFile"), uploadExamCSVHandler);

module.exports = router;