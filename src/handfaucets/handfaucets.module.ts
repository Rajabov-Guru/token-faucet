import { Module } from '@nestjs/common';
import { HandfaucetsService } from './handfaucets.service';
import { HandfaucetsController } from './handfaucets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Handfaucet } from './entities/handfaucet.entity';
import { HandfaucetEventsListener } from './listeners/handfaucet-events.listener';
import { EventsModule } from '../events/events.module';
import { NotificationsService } from '../events/notifications.service';

@Module({
  imports:[
    EventsModule,
    TypeOrmModule.forFeature([Handfaucet])],
  controllers: [HandfaucetsController],
  providers: [HandfaucetsService,NotificationsService,HandfaucetEventsListener],
  exports:[HandfaucetsService]
})
export class HandfaucetsModule {}
