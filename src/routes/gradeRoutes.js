const express = require("express");
const router = express.Router();
const { getGrade } = require("../controllers/gradeController");

router.post("/calculate-grade", getGrade);

module.exports = router;