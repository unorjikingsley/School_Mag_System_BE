/*
  Warnings:

  - Added the required column `departmentNo` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facultyNo` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matricNo` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "departmentNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Faculty" ADD COLUMN     "facultyNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "matricNo" INTEGER NOT NULL;
