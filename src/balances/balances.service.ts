import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { Repository } from 'typeorm';
import { SetRewardDto } from './dto/set-reward.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BalanceRewardsEvent } from './events/balance-rewards.event';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BalancesService {

  constructor(@InjectRepository(Balance) private balanceRepository:Repository<Balance>,
              private eventEmitter: EventEmitter2) {
  }

  async create(user:User){
    const balance = new Balance();
    balance.user = user;
    return this.balanceRepository.save(balance);
  }

  async findAll() {
    return this.balanceRepository.find();
  }

  findOne(id: number) {
    return this.balanceRepository.findOneBy({id})
  }

  async save(balance:Balance){
    return this.balanceRepository.save(balance);
  }

  async getUser(id:number){
    const balance = await this.balanceRepository.findOne({where:{id},relations:{user:true}});
    return balance.user;
  }

  async setRewards(id:number,data:SetRewardDto){
    const balance = await this.findOne(id);
    balance.tokens += data.tokens;
    balance.satoshi += data.satoshi;
    balance.experience += data.experience;
    balance.energy += data.energy;
    balance.clicks += data.clicks;

    const user = await this.getUser(balance.id);
    const balanceRewards = new BalanceRewardsEvent();
    balanceRewards.userId = user.id;
    balanceRewards.experience = balance.experience;
    this.eventEmitter.emit('balance.rewards',balanceRewards);

    return this.balanceRepository.save(balance);
  }

  async minusSatoshi(balanceId:number,satoshi:number){
    const balance = await this.balanceRepository.findOneBy({id:balanceId});
    if(balance.satoshi>=satoshi){
      balance.satoshi -= satoshi;
      return await this.balanceRepository.save(balance);
    }
    else{
      throw new HttpException('Not enough satoshi', HttpStatus.BAD_REQUEST);
    }
  }

  async minusEnergy(balanceId:number,energy:number){
    const balance = await this.balanceRepository.findOneBy({id:balanceId});
    if(balance.energy>=energy){
      balance.energy -= energy;
      return await this.balanceRepository.save(balance);
    }
    else{
      throw new HttpException('Not enough energy', HttpStatus.BAD_REQUEST);
    }

  }
}
