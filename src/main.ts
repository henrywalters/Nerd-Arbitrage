import { NestFactory } from '@nestjs/core';
import { chdir } from 'process';
import { AppModule } from './app.module';
import { EbayScraper } from './scrapers/ebay.scraper';

async function bootstrap() {
    if (!process.env.APP_PORT) throw new Error("Env variable APP_PORT required to launch.");
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.APP_PORT);
}
bootstrap();
