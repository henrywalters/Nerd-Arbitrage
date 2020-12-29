import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {ComicBook} from "./comicBook.entity";

export enum ListingType {
    Auction= "AUCTION",
    ForSale = "FOR_SALE",
}

@Entity()
export class ComicBookListing extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @ManyToOne(type => ComicBook)
    @JoinColumn()
    public comicBook: ComicBook;

    @Column({type: "integer", nullable: true})
    public listingEndsInSeconds?: number;

    @Column()
    public source: string;

    @Column()
    public sourceId: string;

    @Column()
    public sourceUrl: string;

    @Column({type: "enum", enum: ListingType})
    public type: ListingType;

    @Column({type: "text"})
    public description: string;

    @Column({type: "simple-array"})
    public certificates: string[];

    @Column()
    public condition: string;

    public static async SearchOne(source: string, sourceId: string): Promise<ComicBookListing | null> {
        return await ComicBookListing.findOne({
            where: {
                source,
                sourceId,
            }
        });
    }
}

@Entity()
export class AuctionTimePoint extends BaseEntity {

    @ManyToOne(type => ComicBookListing)
    @JoinColumn()
    public listing: ComicBookListing;

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: "float"})
    public currentBid: number;

    @Column({type: "float", nullable: true})
    public nextBid: number;

    @CreateDateColumn()
    public timestamp: Date;
}

@Entity()
export class ForSaleTimePoint extends BaseEntity {

    @ManyToOne(type => ComicBookListing)
    @JoinColumn()
    public listing: ComicBookListing;

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: "float"})
    public buyNowPrice: number;

    @Column({type: "float", nullable: true})
    public bestOffer?: number;

    @CreateDateColumn()
    public timestamp: Date;
}