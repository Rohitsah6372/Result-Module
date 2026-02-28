const express = require("express");
const router = express.Router();
const { predictStudentHandler } = require("../controllers/mlController");

router.get("/students/:studentName/predict", predictStudentHandler);

module.exports = router;