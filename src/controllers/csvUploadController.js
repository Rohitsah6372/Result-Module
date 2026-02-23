const { processCSV } = require("../services/csvUploadService");

async function uploadCSVHandler(req, res) {
  try {
    const { examId, examSubjectId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "CSV file required" });
    }

    const result = await processCSV(
      req.file.buffer,
      examId,
      examSubjectId
    );

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { uploadCSVHandler };