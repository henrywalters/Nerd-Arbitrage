import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateComicBookListingTable1598060347390 implements MigrationInterface {
    name = 'CreateComicBookListingTable1598060347390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `comic_book_listing` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `variant` varchar(255) NULL, `volume` varchar(255) NULL, `issue` varchar(255) NULL, `condition` varchar(255) NULL, `price` float NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `comic_book_listing`");
    }

}
