-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `logo` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nik` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `doj` DATETIME(3) NOT NULL,
    `salary` DECIMAL(65, 30) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `gp` DECIMAL(65, 30) NULL,
    `tunjangan` DECIMAL(65, 30) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Employee_nik_userId_key`(`nik`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `retirementAge` INTEGER NOT NULL DEFAULT 55,
    `pensionMultiplier` DECIMAL(65, 30) NOT NULL DEFAULT 1.75,
    `disabilityMult` DECIMAL(65, 30) NOT NULL DEFAULT 2.0,
    `deathMult` DECIMAL(65, 30) NOT NULL DEFAULT 2.0,
    `resignMult` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `CompanyRule_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActuarialResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `calcDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `employeeId` INTEGER NOT NULL,
    `pvdbo` DECIMAL(65, 30) NOT NULL,
    `serviceCost` DECIMAL(65, 30) NOT NULL,
    `interestCost` DECIMAL(65, 30) NOT NULL,
    `discountRate` DECIMAL(65, 30) NOT NULL,
    `salaryInc` DECIMAL(65, 30) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyRule` ADD CONSTRAINT `CompanyRule_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActuarialResult` ADD CONSTRAINT `ActuarialResult_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
