import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Autofaucet } from './entities/autofaucet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { getAutoSettings } from '../settings/autofaucet.settings';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AutofaucetsService {
  @InjectRepository(Autofaucet)
  private autofaucetRepository:Repository<Autofaucet>;

  @Inject(forwardRef(()=>UsersService))
  private readonly userService:UsersService;

  @Inject(SchedulerRegistry)
  private schedulerRegistry: SchedulerRegistry;


  constructor() {
  }

  async setAllTimeouts(){
    const timingFaucets = await this.findAllTiming();
    for (let i = 0; i < timingFaucets.length; i++) {
      const faucet:Autofaucet = timingFaucets[0];

      const name = `${faucet.id}.getRewardTimeout`;
      const faucetStart = new Date(faucet!.timerStart);
      const now = new Date();
      now.setMilliseconds(0);
      const diff = now.getTime() - faucetStart.getTime();
      const milliseconds = (faucet.timerAmount * 60000) - diff;

      const callback = async() => {
        await this.rewardTimeoutCallback(faucet.id,name);
      };

      const timeout = setTimeout(callback, milliseconds);
      this.schedulerRegistry.addTimeout(name, timeout);
    }
  }

  async create(user:User){
    const autofaucet = new Autofaucet();
    autofaucet.user = user;
    return await this.autofaucetRepository.save(autofaucet);
  }

  async findAll() {
    return this.autofaucetRepository.find();
  }

  async findAllTiming() {
    return this.autofaucetRepository.find({
      where:{
        timerStart:Not(IsNull()),
      }
    });
  }

  findOne(id: number) {
    return this.autofaucetRepository.findOneBy({id});
  }

  async save(autofaucet:Autofaucet){
    return this.autofaucetRepository.save(autofaucet);
  }

  async getUser(id:number){
    const autofaucet = await this.autofaucetRepository.findOne({
      where:{id},
      relations:{
        user:true,
      }
    });

    return autofaucet.user;
  }

  async addSatoshi(id:number, satoshi:number){
    let faucet = await this.autofaucetRepository.findOne({where:{id},relations:{user:true}});
    faucet.satoshi += satoshi;
    faucet.clicks = faucet.clicks+1;
    let saved = await this.autofaucetRepository.save(faucet);
    return saved;
  }

  async checkLevel(faucetId:number){
    const faucet = await this.findOne(faucetId);
    const nextLevel = faucet.level+1;
    const settings = getAutoSettings(nextLevel);
    if(faucet.clicks >= settings.requiredClicks){
      faucet.level = settings.level;
      await this.autofaucetRepository.save(faucet);
      return true;
    }
    return false;
  }

  async activateAutofaucet(faucetId:number, cycles:number, subs:boolean=false){
    const faucet = await this.findOne(faucetId);
    const user = await this.getUser(faucet.id);
    const seconds = (cycles * faucet.timerAmount*60);
    const now = new Date();
    now.setMilliseconds(0);
    faucet.timerStart = now;
    faucet.activatedStart = now;
    faucet.activated = true;
    faucet.activatedTime = seconds;
    faucet.rewardCount = cycles;
    if(subs) faucet.subscriptionStart = now;
    const saved = await this.autofaucetRepository.save(faucet);
    await this.addRewardTimeouts(faucet.id);
    await this.userService.handleAutofaucetChangeActivated(user.id);
    return saved;
  }

  async deActivateAutofaucet(faucetId:number){
    let faucet = await this.findOne(faucetId);
    const user = await this.getUser(faucet.id);
    faucet.timerStart = null;
    faucet.activated = false;
    faucet.activatedStart = null;
    faucet.activatedTime = 0;
    faucet.rewardCount = 0;
    const saved = await this.autofaucetRepository.save(faucet);
    await this.userService.handleAutofaucetChangeActivated(user.id);
    return saved;
  }

  async rewardTimeoutCallback(faucetId:number, name:string){
    let faucet = await this.findOne(faucetId);
    const user = await this.getUser(faucet.id);
    faucet.rewardCount -=1;
    faucet.spentTime += faucet.timerAmount;
    faucet = await this.autofaucetRepository.save(faucet);
    await this.userService.setAutoRewards(user.id);

    if(faucet.rewardCount===0) {
      const doesExist = this.schedulerRegistry.doesExist('timeout',name);
      if(doesExist) this.schedulerRegistry.deleteTimeout(name);

      const saved = await this.deActivateAutofaucet(faucet.id);
      await this.checkDelayedSubscription(saved,user);
      return;
    }

    this.schedulerRegistry.deleteTimeout(name);
    await this.addRewardTimeouts(faucet.id);
    await this.setTimeStart(faucet.id);
  }

  async addRewardTimeouts(faucetId:number){
    let faucet = await this.findOne(faucetId);
    const milliseconds = faucet.timerAmount*60000;
    const name = `${faucet.id}.getRewardTimeout`;

    const callback = async() => {
      await this.rewardTimeoutCallback(faucet.id,name);
    };

    const nextTimeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name,nextTimeout);
    console.log(`Timeout ${name} set in (${milliseconds})!`);
  }

  async setSubscription(autofaucetId:number,months:number){
    let faucet = await this.autofaucetRepository.findOne({where:{id:autofaucetId},relations:{user:true}});
    faucet.subscriptionMonth = months;
    faucet.subscription = true;
    faucet = await this.autofaucetRepository.save(faucet);
    return faucet;
  }

  async checkDelayedSubscription(faucet:Autofaucet, user:User){
    if(faucet.subscription && !faucet.subscriptionStart){
      await this.userService.activateAutofaucetSubscription(user.id,faucet.id);
    }
    else if(faucet.subscription && faucet.subscriptionStart){
      await this.removeSubscription(faucet.id);
    }
  }

  async activateSubscription(faucetId:number){
    const faucet = await this.findOne(faucetId);
    if(faucet.activated) return false;
    else{
      const days = faucet.subscriptionMonth * 30;
      const hours = days * 24;
      const minutes = hours * 60;
      const cycles = Math.floor(minutes/faucet.timerAmount);

      await this.activateAutofaucet(faucet.id,cycles,true);
      return true;
    }
  }

  async setTimeStart(faucetId:number){
    let faucet = await this.findOne(faucetId);
    const now = new Date();
    now.setMilliseconds(0);
    faucet.timerStart = now;
    return await this.autofaucetRepository.save(faucet);
  }

  async removeSubscription(faucetId:number){
    let faucet = await this.findOne(faucetId);
    faucet.subscriptionStart = null;
    faucet.subscriptionMonth = 0;
    faucet.subscription = false;
    return await this.autofaucetRepository.save(faucet);
  }

}
