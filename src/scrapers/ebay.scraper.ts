import { IScraper } from "src/interfaces/iscraper";

import * as eBay from 'ebay-node-client';
import { ComicBook } from "src/entities/comicBook.entity";

export interface EbayCategory {
    id: string;
    name: string;
}

interface ParsedTitle {
    title: string;
    volume?: string;
    issue?: number;
    condition?: string;
    certifiers: string[];
}

export const EBAY_COMIC_CATEGORIES: {[key: string]: EbayCategory} = {
    PLATINUM_AGE: {
        name: 'Platinum Age (1897-1937)',
        id: '65'
    },
    GOLDEN_AGE: {
        name: 'Golden Age (1938-55)',
        id: '66',
    },
    SILVER_AGE: {
        name: 'Silver Age (1956-69)',
        id: '73'
    },
    MODERN_AGE: {
        name: 'Modern Age (1992-Now)',
        id: '900',
    },
    BRONZE_AGE: {
        name: "Bronze Age (1970-83)",
        id: '12590',
    },
    COPPER_AGE: {
        name: 'Copper Age (1984-1991)',
        id: '165364'
    }
}

export class EbayScraper implements IScraper {

    private ebay: eBay;

    constructor() {
        this.ebay = new eBay();
        this.ebay.setApiKey(process.env.EBAY_CLIENT_ID, process.env.EBAY_CLIENT_SECRET);
    }

    public async setToken() {
        try {
            const token = await this.ebay.application.getOAuthToken({
                grant_type: 'client_credentials',
                scope: 'https://api.ebay.com/oauth/api_scope',
            });

            this.ebay.setToken(token.access_token);

        } catch (e) {
            console.log(e);
            throw new Error("Failed to establish OAuth token for ebay");
        }
    }

    private async handleAuth<T>(func: () => Promise<T>): Promise<T> {
        try {
            return await func();
        } catch (e) {
            await this.setToken();

            try {
                return await func();
            } catch (e) {
                console.log(e);
                throw new Error("Failed to set OAuth token for request");
            }
        }
    }

    public async searchItems(query: string) {
        return await this.handleAuth(() => {
            return this.ebay.browse.search({
                q: query,
                limit: 1,
            })
        })
    }

    public async getItem(id: string) {
        return await this.handleAuth(() => {
            return this.ebay.browse.getItem(id);
        });
    }

    public get eBay() {
        return this.ebay;
    }

    public async getCategoryTree(id: string) {
        return await this.handleAuth(() => {
            return this.ebay.taxonomy.getCategoryTree(id);
        })
    }

    public parseTitle(title: string): ParsedTitle {

        const yearRegex = /\d{4}/gi;
        const issueRegex = /#(\w+)\b/gi;
        const conditionRegex = /\d+\.?\d*/gi;

        const certs = [
            'CGC',
            'CBCS',
        ]

        const parsed: ParsedTitle = {
            title: '',
            certifiers: [],
        }

        const year = title.match(yearRegex);
        if (year) {
            parsed.volume = year[0];
            title = title.replace(yearRegex, '');
        } 

        const issue = title.match(issueRegex);
        if (issue) {
            parsed.issue = parseInt(issue[0].slice(1));
            parsed.title = title.split(issueRegex)[0].trim();
            title = title.replace(issueRegex, '');
        }
        console.log(issue);

        const condition = title.match(conditionRegex);
        if (condition) {
            parsed.condition = condition[0];
            title = title.replace(conditionRegex, '');
        }

        for (const cert of certs) {
            if (title.indexOf(cert) !== -1) {
                parsed.certifiers.push(cert);
                title.replace(cert, '');
            }
        }

        return parsed;
    }

    async scrapeMarketplace(): Promise<void> {

        const pageSize = 200;

        for (const category of Object.values(EBAY_COMIC_CATEGORIES)) {
            console.log("Searching " + category.name);
            const initialSearch = await this.handleAuth(() => this.ebay.browse.search({
                category_ids: category.id,
                limit: 1,
            }));

            const total = parseInt(initialSearch.total);

            console.log("Total comic books: " + total);

            const pages = Math.ceil(total / pageSize);

            for (let i = 0; i < pages; i++) {
                console.log("Parsing page " + i + " / " + pages );
                const res = await this.handleAuth(() => this.ebay.browse.search({
                    category_ids: category.id,
                    limit: pageSize,
                    offset: i * pageSize,
                }))

                const listings = res.itemSummaries;

                for (const listing of listings) {
                    const parsed = this.parseTitle(listing.title);
                    if (parsed.title !== '' && parsed.issue && parsed.volume) {
                        const comic = await ComicBook.SearchOne(parsed.title, parsed.issue, parsed.volume);
                        console.log(comic);
                    }
                }
            }
        }
    }
}