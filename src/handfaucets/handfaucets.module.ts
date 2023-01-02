import { Module } from '@nestjs/common';
import { HandfaucetsService } from './handfaucets.service';
import { HandfaucetsController } from './handfaucets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Handfaucet } from './entities/handfaucet.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Handfaucet])],
  controllers: [HandfaucetsController],
  providers: [HandfaucetsService],
  exports:[HandfaucetsService]
})
export class HandfaucetsModule {}
