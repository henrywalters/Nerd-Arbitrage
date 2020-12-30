import { IScraper } from "src/interfaces/iscraper";

import * as eBay from 'ebay-node-client';

export class EbayScraper implements IScraper {

    private ebay: eBay;

    constructor() {
        this.ebay = new eBay();
        this.ebay.setApiKey(process.env.EBAY_CLIENT_ID, process.env.EBAY_CLIENT_SECRET);
        this.setToken();
    }

    private async setToken() {
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

    public async getItem(id: string) {
        return await this.handleAuth(() => {
            return this.ebay.browse.getItem(id);
        });
    }

    async scrapeMarketplace(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}