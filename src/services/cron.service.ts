import {Injectable} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {MarketplaceService} from "./marketplace.service";

@Injectable()
export class CronService {
    private isScraping = false;
    private run = true;

    constructor(private readonly marketplace: MarketplaceService) {}

    @Cron(CronExpression.EVERY_5_SECONDS)
    async scrapeMarketplaces() {
        if (!this.isScraping && this.run) {
            console.log("Scraping Marketplaces");
            this.isScraping = true;
            await this.marketplace.scrapeMarketplaces();
            this.isScraping = false;
        }
    }
}