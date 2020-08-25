export interface IScraper {
    scrapeMarketplace(): Promise<void>;
}