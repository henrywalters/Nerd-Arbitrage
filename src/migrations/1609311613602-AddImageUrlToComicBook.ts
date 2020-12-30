import {MigrationInterface, QueryRunner} from "typeorm";

export class AddImageUrlToComicBook1609311613602 implements MigrationInterface {
    name = 'AddImageUrlToComicBook1609311613602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `comic_book` ADD `imageUrl` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `comic_book` DROP COLUMN `imageUrl`");
    }

}
