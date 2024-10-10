/*
  Warnings:

  - Added the required column `tone` to the `SavedPodcast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedPodcast" ADD COLUMN     "tone" TEXT NOT NULL;
