import { Module } from '@nestjs/common';
import { HandfaucetsService } from './handfaucets.service';
import { HandfaucetsController } from './handfaucets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Handfaucet } from './entities/handfaucet.entity';
import { EventsService } from '../events.service';
import { HandfaucetEventsListener } from './listeners/handfaucet-events.listener';

@Module({
  imports:[TypeOrmModule.forFeature([Handfaucet])],
  controllers: [HandfaucetsController],
  providers: [HandfaucetsService,HandfaucetEventsListener, EventsService],
  exports:[HandfaucetsService]
})
export class HandfaucetsModule {}
