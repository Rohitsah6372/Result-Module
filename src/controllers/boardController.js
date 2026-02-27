const { createBoard } = require("../services/boardService");
const csv = require("csv-parser");
const prisma = require("../config/prisma");
const { Readable } = require("stream");

async function createBoardHandler(req, res) {
  try {
    const board = await createBoard(req.body);
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function uploadBoardCSVHandler(req, res) {
  try {
    const results = [];
    const bufferStream = Readable.from(req.file.buffer);

    bufferStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (const row of results) {
          await prisma.board.create({
            data: {
              name: row.name,
              academicYear: row.academicYear
            }
          });
        }

        res.json({ message: "Boards uploaded successfully" });
      });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createBoardHandler, uploadBoardCSVHandler };