import { forwardRef, Module } from '@nestjs/common';
import { AutofaucetsService } from './autofaucets.service';
import { AutofaucetsController } from './autofaucets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Autofaucet } from './entities/autofaucet.entity';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';
import { NotificationsService } from '../events/notifications.service';

@Module({
  imports:[
    EventsModule,
    TypeOrmModule.forFeature([Autofaucet]),
    forwardRef(()=>UsersModule),
  ],
  controllers: [AutofaucetsController],
  providers: [AutofaucetsService, NotificationsService],
  exports:[AutofaucetsService]
})
export class AutofaucetsModule {}
