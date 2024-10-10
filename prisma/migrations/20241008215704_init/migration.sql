-- CreateTable
CREATE TABLE "SavedPodcast" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedPodcast_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedPodcast" ADD CONSTRAINT "SavedPodcast_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
