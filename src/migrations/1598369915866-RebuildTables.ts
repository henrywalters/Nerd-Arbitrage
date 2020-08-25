import {MigrationInterface, QueryRunner} from "typeorm";

export class RebuildTables1598369915866 implements MigrationInterface {
    name = 'RebuildTables1598369915866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `comic_book` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `variant` varchar(255) NULL, `volume` varchar(255) NULL, `issue` int NOT NULL, INDEX `IDX_1f7a7486cfd0b84499fca3b5c8` (`title`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `comic_book_listing` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `listingEndsInSeconds` int NULL, `source` varchar(255) NOT NULL, `sourceId` varchar(255) NOT NULL, `sourceUrl` varchar(255) NOT NULL, `type` enum ('AUCTION', 'FOR_SALE') NOT NULL, `description` text NOT NULL, `certificates` text NOT NULL, `condition` varchar(255) NOT NULL, `comicBookId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `auction_time_point` (`id` int NOT NULL AUTO_INCREMENT, `currentBid` float NOT NULL, `nextBid` float NOT NULL, `timestamp` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `listingId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `for_sale_time_point` (`id` int NOT NULL AUTO_INCREMENT, `buyNowPrice` float NOT NULL, `bestOffer` float NULL, `timestamp` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `listingId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `comic_book_listing` ADD CONSTRAINT `FK_f9ff50aa6e889e1be03a43a5fa5` FOREIGN KEY (`comicBookId`) REFERENCES `comic_book`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `auction_time_point` ADD CONSTRAINT `FK_3e821d9a32eacb9a479fd066683` FOREIGN KEY (`listingId`) REFERENCES `comic_book_listing`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `for_sale_time_point` ADD CONSTRAINT `FK_ebe05811e6a67b03194451d728e` FOREIGN KEY (`listingId`) REFERENCES `comic_book_listing`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `for_sale_time_point` DROP FOREIGN KEY `FK_ebe05811e6a67b03194451d728e`");
        await queryRunner.query("ALTER TABLE `auction_time_point` DROP FOREIGN KEY `FK_3e821d9a32eacb9a479fd066683`");
        await queryRunner.query("ALTER TABLE `comic_book_listing` DROP FOREIGN KEY `FK_f9ff50aa6e889e1be03a43a5fa5`");
        await queryRunner.query("DROP TABLE `for_sale_time_point`");
        await queryRunner.query("DROP TABLE `auction_time_point`");
        await queryRunner.query("DROP TABLE `comic_book_listing`");
        await queryRunner.query("DROP INDEX `IDX_1f7a7486cfd0b84499fca3b5c8` ON `comic_book`");
        await queryRunner.query("DROP TABLE `comic_book`");
    }

}
