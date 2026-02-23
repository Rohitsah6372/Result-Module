-- CreateIndex
CREATE INDEX "Exam_boardId_idx" ON "Exam"("boardId");

-- CreateIndex
CREATE INDEX "GradingRule_boardId_idx" ON "GradingRule"("boardId");

-- CreateIndex
CREATE INDEX "StudentResult_examId_idx" ON "StudentResult"("examId");

-- CreateIndex
CREATE INDEX "StudentResult_studentName_idx" ON "StudentResult"("studentName");
