import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

export enum MarketType {
    Auction,
    Direct,
}

@Entity()
export class ComicBookListing extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    public name: string;

    @Column({nullable: true})
    public variant: string;

    @Column({nullable: true})
    public volume: string;

    @Column({nullable: true})
    public issue: string;

    @Column({nullable: true})
    public condition: string;

    @Column({type: "enum", enum: MarketType})

    @Column({type: "float"})
    public price: number;
}