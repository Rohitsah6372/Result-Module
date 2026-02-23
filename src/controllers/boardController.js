const { createBoard } = require("../services/boardService");

async function createBoardHandler(req, res) {
  try {
    const board = await createBoard(req.body);
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createBoardHandler };