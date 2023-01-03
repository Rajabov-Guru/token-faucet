import { forwardRef, Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[
    forwardRef(()=>UsersModule),
    TypeOrmModule.forFeature([Balance])],
  controllers: [BalancesController],
  providers: [BalancesService],
  exports:[BalancesService]
})
export class BalancesModule {}
