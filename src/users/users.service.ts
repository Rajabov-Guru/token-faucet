import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BalancesService } from '../balances/balances.service';
import { HandfaucetsService } from '../handfaucets/handfaucets.service';
import { Balance } from '../balances/entities/balance.entity';
import { Handfaucet } from '../handfaucets/entities/handfaucet.entity';
import { handfaucetSettings } from '../helpers/faucet.settings';
import { SetRewardDto } from '../balances/dto/set-reward.dto';

@Injectable()
export class UsersService {
  @Inject(BalancesService)
  private readonly balanceService:BalancesService;

  @Inject(HandfaucetsService)
  private readonly handfaucetService:HandfaucetsService;

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = createUserDto as User;
    await this.userRepository.save(newUser);

    const balance = new Balance();
    balance.user = newUser;
    await this.balanceService.save(balance);

    const handfaucet = new Handfaucet();
    handfaucet.user = newUser;
    await this.handfaucetService.save(handfaucet);

    //bonuses
    return newUser;

  }

  async findAll() {
    return this.userRepository.find();
  }

  async getBalance(id:number){
    const user = await this.userRepository.findOne({
      where:{id},
      relations:{
        balance:true
      }
    });
    return user.balance;
  }

  async getHandFaucet(id:number){
    const user = await this.userRepository.findOne({
      where:{id},
      relations:{
        handfaucet:true
      }
    });
    return user.handfaucet;
  }

  private getSettings(level:number){
    return handfaucetSettings.filter(set=>set.level===level)[0];
  }

  async setRewards(id:number){
    const user = await this.userRepository.findOne({
      where:{
        id
      },
      relations:{
        handfaucet:true,
        balance:true,
      }
    });

    const balance = user.balance;
    const handfaucet = user.handfaucet;

    const settings = this.getSettings(handfaucet.level);
    const rewards = settings.rewards;

    const bonuses = rewards.levelBonus;
    const base = rewards.base;
    const experience = rewards.experience;
    const energy = rewards.energy;
    const satoshi = 0;
    const clicks = 0;
    const tokens = base+(base / 100 * bonuses)

    const data:SetRewardDto={
      tokens,
      experience,
      energy,
      satoshi,
      clicks
    }
    const res = await this.balanceService.setRewards(balance.id,data);
    await this.handfaucetService.addTokens(handfaucet.id,tokens);
    // await this.checkLevel(id);
    return res;
  }

  private async checkLevel(id:number){
    const user = await this.userRepository.findOne({
      where:{
        id
      },
      relations:{
        balance:true,
      }
    });
    const exp = user.balance.experience;
    const level = user.level;
    if(Math.floor(exp/100)!==level-1){
      user.level +=1;
      await this.userRepository.save(user);

    }
  }

  async getToken(id:number){
    const user = await this.userRepository.findOne({
      where:{id},
      relations:{
        token:true
      }
    });
    return user.token;
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email:string){
    return this.userRepository.findOneBy({email});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return this.userRepository.save({...user, ...updateUserDto});
  }

  async save(user:User){
    return this.userRepository.save(user);
  }

}
