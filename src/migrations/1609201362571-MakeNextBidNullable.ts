import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeNextBidNullable1609201362571 implements MigrationInterface {
    name = 'MakeNextBidNullable1609201362571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `auction_time_point` CHANGE `currentBid` `currentBid` float NOT NULL");
        await queryRunner.query("ALTER TABLE `auction_time_point` CHANGE `nextBid` `nextBid` float NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `auction_time_point` CHANGE `nextBid` `nextBid` float NOT NULL");
        await queryRunner.query("ALTER TABLE `auction_time_point` CHANGE `currentBid` `currentBid` float NULL");
    }

}
