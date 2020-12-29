import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeCurrentBidNullable1609200972866 implements MigrationInterface {
    name = 'MakeCurrentBidNullable1609200972866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `auction_time_point` CHANGE `currentBid` `currentBid` float NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `auction_time_point` CHANGE `currentBid` `currentBid` float NOT NULL");
    }

}
