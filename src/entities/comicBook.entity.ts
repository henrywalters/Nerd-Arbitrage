import {BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

export enum MarketType {
    Auction,
    Direct,
}

@Entity()
export class ComicBook extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @Index()
    public title: string;

    @Column({nullable: true})
    public variant?: string;

    @Column({nullable: true})
    public volume?: string;

    @Column({type: "integer"})
    public issue: number;

    public static async SearchOne(title: string, issue: number, volume?: string): Promise<ComicBook | null> {
        return await ComicBook.findOne({
            where: {
                title,
                issue,
                volume,
            }
        });
    }

    public static async Search(title: string, volume?: string): Promise<ComicBook[]> {
        return await ComicBook.find({
            where: {
                title,
                volume,
            }
        })
    }
}