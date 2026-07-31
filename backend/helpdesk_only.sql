START TRANSACTION;

CREATE TABLE `TicketCategories` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Description` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `Icon` varchar(100) CHARACTER SET utf8mb4 NULL,
    `Active` tinyint(1) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    CONSTRAINT `PK_TicketCategories` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Tickets` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UserId` int NOT NULL,
    `TicketCategoryId` int NOT NULL,
    `Subject` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
    `Status` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `Priority` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `LastReplyAt` datetime(6) NULL,
    `ClosedAt` datetime(6) NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    CONSTRAINT `PK_Tickets` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Tickets_TicketCategories_TicketCategoryId` FOREIGN KEY (`TicketCategoryId`) REFERENCES `TicketCategories` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_Tickets_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;

CREATE TABLE `TicketMessages` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `TicketId` int NOT NULL,
    `UserId` int NOT NULL,
    `Origin` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `Content` longtext CHARACTER SET utf8mb4 NOT NULL,
    `EmailMessageId` varchar(300) CHARACTER SET utf8mb4 NULL,
    `Read` tinyint(1) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    CONSTRAINT `PK_TicketMessages` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_TicketMessages_Tickets_TicketId` FOREIGN KEY (`TicketId`) REFERENCES `Tickets` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_TicketMessages_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;

CREATE TABLE `TicketTimelines` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `TicketId` int NOT NULL,
    `UserId` int NOT NULL,
    `Event` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `Description` varchar(500) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    CONSTRAINT `PK_TicketTimelines` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_TicketTimelines_Tickets_TicketId` FOREIGN KEY (`TicketId`) REFERENCES `Tickets` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_TicketTimelines_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;

CREATE TABLE `TicketAttachments` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `TicketMessageId` int NOT NULL,
    `OriginalFileName` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
    `StoredFileName` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
    `Bucket` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Path` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
    `MimeType` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `Size` bigint NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    CONSTRAINT `PK_TicketAttachments` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_TicketAttachments_TicketMessages_TicketMessageId` FOREIGN KEY (`TicketMessageId`) REFERENCES `TicketMessages` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_TicketAttachments_TicketMessageId` ON `TicketAttachments` (`TicketMessageId`);

CREATE INDEX `IX_TicketMessages_TicketId` ON `TicketMessages` (`TicketId`);

CREATE INDEX `IX_TicketMessages_UserId` ON `TicketMessages` (`UserId`);

CREATE INDEX `IX_Tickets_CreatedAt` ON `Tickets` (`CreatedAt`);

CREATE INDEX `IX_Tickets_LastReplyAt` ON `Tickets` (`LastReplyAt`);

CREATE INDEX `IX_Tickets_Status` ON `Tickets` (`Status`);

CREATE INDEX `IX_Tickets_TicketCategoryId` ON `Tickets` (`TicketCategoryId`);

CREATE INDEX `IX_Tickets_UserId` ON `Tickets` (`UserId`);

CREATE INDEX `IX_TicketTimelines_TicketId` ON `TicketTimelines` (`TicketId`);

CREATE INDEX `IX_TicketTimelines_UserId` ON `TicketTimelines` (`UserId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260731143424_AddHelpdeskModule', '8.0.8');

COMMIT;

