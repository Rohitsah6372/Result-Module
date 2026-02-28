const express = require("express");
const router = express.Router();
const { getStudentInsightHandler } = require("../controllers/insightController");

router.get("/students/:studentName/insight", getStudentInsightHandler);

module.exports = router;