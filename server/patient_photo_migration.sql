-- SQL Migration: Add photo column to patients table
-- This migration should be run on the database to support the new Patient Photo Upload feature.

-- Assuming the primary table is `copy_of_patientdetaiils` (used in patient.service.js)
ALTER TABLE `copy_of_patientdetaiils`
ADD COLUMN `photo` VARCHAR(255) NULL AFTER `status`;

-- If there is a `patients` table (as requested in the prompt), also run this:
ALTER TABLE `patients`
ADD COLUMN `photo` VARCHAR(255) NULL AFTER `status`;