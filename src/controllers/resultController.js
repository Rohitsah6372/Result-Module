const { createStudentResult } = require("../services/resultService");

async function createResultHandler(req, res) {
  try {
    const result = await createStudentResult(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createResultHandler };