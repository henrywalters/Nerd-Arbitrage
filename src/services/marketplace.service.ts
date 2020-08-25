import {Injectable} from "@nestjs/common";
import {IScraper} from "../interfaces/iscraper";
import {ComicconnectScraper} from "../scrapers/comicconnect.scraper";

@Injectable()
export class MarketplaceService {
    private readonly scrapers: IScraper[];

    constructor() {
        this.scrapers = [
            new ComicconnectScraper(),
        ];
    }

    public async scrapeMarketplaces() {
        for (const scraper of this.scrapers) {
            await scraper.scrapeMarketplace();
        }
    }
}