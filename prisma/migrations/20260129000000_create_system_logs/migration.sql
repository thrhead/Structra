-- CreateTable
CREATE TABLE "system_logs" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "platform" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "system_logs_level_createdAt_idx" ON "system_logs"("level", "createdAt");

-- CreateIndex
CREATE INDEX "system_logs_platform_createdAt_idx" ON "system_logs"("platform", "createdAt");

-- CreateIndex
CREATE INDEX "system_logs_userId_createdAt_idx" ON "system_logs"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
