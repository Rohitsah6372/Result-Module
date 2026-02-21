const express = require("express");
const router = express.Router();
const { createExamSubjectHandler } = require("../controllers/examSubjectController");

router.post("/exam-subjects", createExamSubjectHandler);

module.exports = router;