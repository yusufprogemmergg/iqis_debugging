-- AlterTable
ALTER TABLE `booking` ADD COLUMN `paymentAmount` INTEGER NULL,
    ADD COLUMN `paymentStatus` ENUM('PAID', 'UNPAID', 'PARTIAL') NULL;
