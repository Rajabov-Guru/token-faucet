import { forwardRef, Module } from '@nestjs/common';
import { BonusesService } from './bonuses.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[
    forwardRef(()=>UsersModule)
  ],
  providers:[BonusesService],
  exports:[BonusesService]
})
export class BonusesModule{}