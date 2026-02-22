-- CreateTable
CREATE TABLE "StudentResult" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "marks" DOUBLE PRECISION NOT NULL,
    "examSubjectId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION,
    "grade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentResult" ADD CONSTRAINT "StudentResult_examSubjectId_fkey" FOREIGN KEY ("examSubjectId") REFERENCES "ExamSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentResult" ADD CONSTRAINT "StudentResult_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
