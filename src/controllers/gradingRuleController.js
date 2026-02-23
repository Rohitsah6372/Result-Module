const { createGradingRule, getGradingRules } = require("../services/gradingRuleService");

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


module.exports = { createGradingRuleHandler, getGradingRulesHandler };