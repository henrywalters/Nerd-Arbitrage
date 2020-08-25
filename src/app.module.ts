import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MarketplaceService} from "./services/marketplace.service";
import {ScheduleModule} from "@nestjs/schedule";
import {CronService} from "./services/cron.service";

@Module({
  imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot(),
      ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, MarketplaceService, CronService],
})
export class AppModule {}
