const { createGradingRule, getGradingRules } = require("../services/gradingRuleService");
const csv = require("csv-parser");
const prisma = require("../config/prisma");
const { Readable } = require("stream");


async function createGradingRuleHandler(req, res) {
  try {
    const { boardId, minMarks, maxMarks, grade } = req.body;

    if (!boardId || minMarks == null || maxMarks == null || !grade) {
      return res.status(400).json({
        error: "boardId, minMarks, maxMarks and grade are required"
      });
    }

    const rule = await createGradingRule(req.body);

    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function getGradingRulesHandler(req, res) {
  try {
    const rules = await getGradingRules();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function uploadGradingRuleCSVHandler(req, res) {
  try {
    const results = [];
    const bufferStream = Readable.from(req.file.buffer);

    bufferStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (const row of results) {
          await prisma.gradingRule.create({
            data: {
              boardId: String(row.boardId),              minMarks: parseFloat(row.minMarks),
              maxMarks: parseFloat(row.maxMarks),
              grade: row.grade
            }
          });
        }

        res.json({ message: "Grading rules uploaded successfully" });
      });

  } catch (error) { 
    res.status(500).json({ error: error.message });
  }

}




module.exports = { createGradingRuleHandler, getGradingRulesHandler, uploadGradingRuleCSVHandler };