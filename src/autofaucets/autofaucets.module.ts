import { forwardRef, Module } from '@nestjs/common';
import { AutofaucetsService } from './autofaucets.service';
import { AutofaucetsController } from './autofaucets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Autofaucet } from './entities/autofaucet.entity';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';
import { NotificationsService } from '../events/notifications.service';
import { AutofaucetEventsListener } from './listeners/autofaucet-events.listener';

@Module({
  imports:[
    TypeOrmModule.forFeature([Autofaucet]),
    forwardRef(()=>UsersModule),
    EventsModule,
  ],
  controllers: [AutofaucetsController],
  providers: [AutofaucetsService,AutofaucetEventsListener, NotificationsService],
  exports:[AutofaucetsService]
})
export class AutofaucetsModule {}
