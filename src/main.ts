import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EbayScraper } from './scrapers/ebay.scraper';

async function bootstrap() {

    const scraper = new EbayScraper();
    console.log(await scraper.getItem('363185373340'));

    if (!process.env.APP_PORT) throw new Error("Env variable APP_PORT required to launch.");
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.APP_PORT);
}
bootstrap();
