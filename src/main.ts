import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    if (!process.env.APP_PORT) throw new Error("Env variable APP_PORT required to launch.");
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.APP_PORT);
}
bootstrap();
