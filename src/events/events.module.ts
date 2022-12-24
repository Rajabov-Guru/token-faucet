import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, NotificationsService],
  exports:[NotificationsService, EventsService]
})
export class EventsModule {}
