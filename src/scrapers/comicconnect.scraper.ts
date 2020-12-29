import * as axios from "axios";
import * as cheerio from "cheerio";
import {IScraper} from "../interfaces/iscraper";
import {AuctionTimePoint, ComicBookListing, ForSaleTimePoint, ListingType} from "../entities/comicBookListing.entity";
import {ComicBook} from "../entities/comicBook.entity";

interface ParsedTitle {
    title: string;
    issue: number;
    volume?: string;
}

interface ParsedCondition {
    condition: string;
    certificates: string[];
}

export class ComicconnectScraper implements IScraper {

    public async scrapeMarketplace() {
        let hasPage = true;
        let page = 1;
        while (hasPage) {
            hasPage = await ComicconnectScraper.ParsePage(page);
            page++;
        }
    }

    private static ParseTitle(title: string): ParsedTitle {
        const result = {
            title: "",
            issue: 0,
            volume: undefined,
        }

        const issueRegex = /#(\w+)\b/gi;
        const parenthesisRegex = /\(([^()]+)\)/g;
        const yearRegex = /\d{4}/;

        result.issue = parseInt(title.match(issueRegex)[0].substr(1));
        title = title.replace(issueRegex, "");

        const volumeYears = title.match(yearRegex);

        if (volumeYears) {
            result.volume = volumeYears[0];
        }

        title = title.replace(parenthesisRegex, "");
        title = title.replace(yearRegex, "");

        title = title.replace("-", "").replace(/\d{2}/, "");

        result.title = title.trim();

        return result;
    }

    private static ParseCondition(condition: string): ParsedCondition {
        const result = {
            condition: "",
            certificates: [],
        }

        const conditionRegex = /\d+\.?\d*/;
        const shortHandRegex = /([a-z\d_-]+):/gi;

        result.condition = condition.match(conditionRegex)[0];
        condition = condition.replace(conditionRegex, "");
        condition = condition.replace("+", "")
            .replace("/", "")
            .replace("-", "")
            .replace(shortHandRegex, "");

        result.certificates = condition.trim().split(" ");

        return result;
    }

    private static async ParsePage(page): Promise<boolean> {
        let html: axios.AxiosResponse;
        try {
            html = await axios.default.get("https://www.comicconnect.com/browse?filters=1&stock_category_id%5B0%5D%5Bo%5D=E&stock_category_id%5B0%5D%5Bv%5D=1&page=" + page);
        } catch (e) {
            return false;
        }

        const $ = cheerio.load(html.data);
        const children = $('.listingbox').children();

        children.each(async (i, child) => {
            try {
                const url = "https://www.comicconnect.com";
                const link = $($(child).find('.details').children('a')[0]).attr('href');
                const listingId = link.split('/')[2];

                const rawTitle = $(child).find(".titleline").text();
                const rawCondition = $(child).find(".grade").text();
                const description = $(child).find('.comments').text();

                const parsedTitle = this.ParseTitle(rawTitle);
                const parsedCondition = this.ParseCondition(rawCondition);

                let comic = await ComicBook.SearchOne(parsedTitle.title, parsedTitle.issue, parsedTitle.volume);

                let listing = await ComicBookListing.SearchOne("comicconnect", listingId);
                let timePoint: AuctionTimePoint | ForSaleTimePoint;

                if (!comic) {
                    comic = new ComicBook();
                    comic.title = parsedTitle.title;
                    comic.issue = parsedTitle.issue;
                    comic.volume = parsedTitle.volume;
                    console.log("Creating record of: " + comic.title + " issue #" + comic.issue);
                    await comic.save();
                }

                if (!listing) {
                    listing = new ComicBookListing();
                    listing.source = "comicconnect";
                    listing.sourceUrl = url + link;
                    listing.sourceId = listingId;
                    listing.description = description;
                    listing.condition = parsedCondition.condition;
                    listing.certificates = parsedCondition.certificates;
                    listing.comicBook = comic;
                    await listing.save();
                }

                const auctionActions = $($(child).find('.auctionactions'));

                if (auctionActions.find('.actionfield') && auctionActions.find('.actionfield').attr('data-type') === "buy") {
                    timePoint = new ForSaleTimePoint();
                    timePoint.buyNowPrice = parseFloat($(child).find('.dollar').val().substr(1));

                    const highestOffer = parseFloat($(child).find('.val').text().substr(1));

                    if (!isNaN(highestOffer)) {
                        timePoint.bestOffer = highestOffer;
                    }

                    listing.type = ListingType.ForSale;

                } else {
                    timePoint = new AuctionTimePoint();
                    timePoint.currentBid = parseFloat($(child).find('.val').text().substr(1));
                    const minBidValue = parseFloat($(child).find('.minbidvalue').text().substr(1));
                    timePoint.nextBid = isNaN(minBidValue) ? null : minBidValue;
                    listing.listingEndsInSeconds = parseInt($(child).find('.countdown-container').attr('data-countdown-ends')) / 1000;
                    listing.type = ListingType.Auction;
                }

                timePoint.listing = listing;
                await timePoint.save();
                await listing.save();
            } catch (e) {
                console.warn(e);
                console.warn("Failed to save page: " + page);
            }
        });

        console.log("Saved results for page: " + page);

        return true;
    }

}