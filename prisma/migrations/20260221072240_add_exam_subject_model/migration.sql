-- CreateTable
CREATE TABLE "ExamSubject" (
    "id" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "maxMarks" INTEGER NOT NULL,
    "internalMarks" INTEGER NOT NULL,
    "externalMarks" INTEGER NOT NULL,
    "examId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamSubject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExamSubject" ADD CONSTRAINT "ExamSubject_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
