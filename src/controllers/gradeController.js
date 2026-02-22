const { calculateGrade } = require("../services/gradeService");



async function getGrade(req, res) {
  try {
    const { boardId, marks } = req.body;

    if (!boardId || marks === undefined) {
      return res.status(400).json({
        error: "boardId and marks are required"
      });
    }

    const grade = await calculateGrade(boardId, parseFloat(marks));

    res.json({ grade });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}





// async function createGradingRuleHandler(req, res) {
//   try {
//     const { boardId, minMarks, maxMarks, grade } = req.body;

//     if (!boardId || minMarks == null || maxMarks == null || !grade) {
//       return res.status(400).json({
//         error: "boardId, minMarks, maxMarks and grade are required"
//       });
//     }

//     const rule = await createGradingRule(req.body);

//     res.status(201).json(rule);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }


module.exports = { getGrade };