START TRANSACTION;

ALTER TABLE `CourseTeachers` ADD `ParticipationPercentage` decimal(65,30) NOT NULL DEFAULT 0.0;

CREATE TABLE `FinancialClosings` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `TeacherId` int NOT NULL,
    `PeriodStart` datetime(6) NOT NULL,
    `PeriodEnd` datetime(6) NOT NULL,
    `GrossRevenue` decimal(10,2) NOT NULL,
    `BankFeesTotal` decimal(10,2) NOT NULL,
    `TheosFeesTotal` decimal(10,2) NOT NULL,
    `NetValue` decimal(10,2) NOT NULL,
    `TotalToReceive` decimal(10,2) NOT NULL,
    `Status` int NOT NULL,
    `PaymentDate` datetime(6) NULL,
    `AsaasTransferId` varchar(100) CHARACTER SET utf8mb4 NULL,
    `PaymentReceiptUrl` varchar(2000) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    CONSTRAINT `PK_FinancialClosings` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_FinancialClosings_Teachers_TeacherId` FOREIGN KEY (`TeacherId`) REFERENCES `Teachers` (`TeacherId`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;

CREATE TABLE `FinancialTaxes` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Type` int NOT NULL,
    `Percentage` decimal(5,4) NOT NULL,
    `EffectiveFrom` datetime(6) NOT NULL,
    `IsActive` tinyint(1) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    CONSTRAINT `PK_FinancialTaxes` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `FinancialClosingItems` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `FinancialClosingId` int NOT NULL,
    `PurchaseId` int NOT NULL,
    `AppliedTeacherPercentage` decimal(5,4) NOT NULL,
    `GrossValue` decimal(10,2) NOT NULL,
    `BankFeeValue` decimal(10,2) NOT NULL,
    `TheosFeeValue` decimal(10,2) NOT NULL,
    `CalculatedValue` decimal(10,2) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    CONSTRAINT `PK_FinancialClosingItems` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_FinancialClosingItems_FinancialClosings_FinancialClosingId` FOREIGN KEY (`FinancialClosingId`) REFERENCES `FinancialClosings` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_FinancialClosingItems_Purchases_PurchaseId` FOREIGN KEY (`PurchaseId`) REFERENCES `Purchases` (`PurchaseId`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_FinancialClosingItems_FinancialClosingId` ON `FinancialClosingItems` (`FinancialClosingId`);

CREATE INDEX `IX_FinancialClosingItems_PurchaseId` ON `FinancialClosingItems` (`PurchaseId`);

CREATE INDEX `IX_FinancialClosings_TeacherId` ON `FinancialClosings` (`TeacherId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260806162357_AddFinancialModule', '8.0.8');

COMMIT;

