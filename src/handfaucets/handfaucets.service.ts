import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Handfaucet } from './entities/handfaucet.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { User } from '../users/entities/user.entity';
import { getSettings } from '../settings/faucet.settings';

@Injectable()
export class HandfaucetsService {
  @InjectRepository(Handfaucet)
  private readonly handfaucetRepository:Repository<Handfaucet>;

  @Inject(SchedulerRegistry)
  private schedulerRegistry: SchedulerRegistry;

  constructor() {}

  async setAllTimeouts(){
    const timingFaucets = await this.findAllTiming();
    for (let i = 0; i < timingFaucets.length; i++) {
      const faucet:Handfaucet = timingFaucets[0];

      const name = `${faucet.id}.removeHandFaucetTimeStart`;
      const faucetStart = new Date(faucet!.timerStart);
      const now = new Date();
      now.setMilliseconds(0);
      const diff = now.getTime() - faucetStart.getTime();
      const milliseconds = (faucet.timerAmount * 60000) - diff;

      const callback = async() => {
        await this.removeTimerCallback(faucet.id,name,milliseconds);
      };

      const timeout = setTimeout(callback, milliseconds);
      this.schedulerRegistry.addTimeout(name, timeout);
    }

    const vipFaucets = await this.findAllWithVip();
    console.log(`vipFaucets.length: ${vipFaucets.length}`);
    for (let i = 0; i < vipFaucets.length; i++) {
      const faucet:Handfaucet = vipFaucets[0];

      const name = `${faucet.id}.removeHandFaucetVipDay`;
      const faucetStart = new Date(faucet!.vipRemoveDayStart);
      const now = new Date();
      now.setMilliseconds(0);
      const diff = now.getTime() - faucetStart.getTime();
      const milliseconds = (60000) - diff;  //one minute   потом поменять на 86400000 (1 день)

      const callback = async() => {
        await this.removeVipDayTimeoutCallback(faucet.id,name);
      };

      const timeout = setTimeout(callback, milliseconds);
      this.schedulerRegistry.addTimeout(name, timeout);
    }

  }

  async create(user:User) {
    const handfaucet = new Handfaucet();
    handfaucet.user = user;
    return this.handfaucetRepository.save(handfaucet);
  }

  findAll() {
    return this.handfaucetRepository.find();
  }

  async findAllTiming() {
    return this.handfaucetRepository.find({
      where:{
        timerStart:Not(IsNull()),
      }
    });
  }

  async findAllWithVip(){
    return this.handfaucetRepository.find({
      where:{
        vip:true,
      }
    });
  }

  findOne(id: number) {
    return this.handfaucetRepository.findOneBy({id});
  }

  save(handfaucet:Handfaucet){
    return this.handfaucetRepository.save(handfaucet);
  }

  async setVip(faucetId:number, months:number){
    const handfaucet = await this.findOne(faucetId);
    const now = new Date();
    now.setMilliseconds(0);
    handfaucet.vipStart = now;
    handfaucet.vipRemoveDayStart = now;
    handfaucet.vipDays = months * 30;
    const hours = handfaucet.vipDays * 24;
    handfaucet.vipActivatedTime = hours*60;
    handfaucet.vip = true;
    const saved  = await this.handfaucetRepository.save(handfaucet);
    await this.addRemoveVipDayTimeout(handfaucet.id);
    return saved;
  }

  async removeVip(faucetId:number){
    const handfaucet = await this.findOne(faucetId);
    handfaucet.vipStart = null;
    handfaucet.vipRemoveDayStart = null;
    handfaucet.vipDays = 0;
    handfaucet.vipActivatedTime = 0;
    handfaucet.vip = false;
    return this.handfaucetRepository.save(handfaucet);
  }

  async addTokens(id:number, tokens:number,energy:number){
    let handfaucet = await this.handfaucetRepository.findOne({where:{id},relations:{user:true}});
    handfaucet.tokens += tokens;
    handfaucet.energy += energy;
    handfaucet.clicks+=1;
    let saved = await this.handfaucetRepository.save(handfaucet);
    saved = await this.setTimeStart(handfaucet.id);
    await this.addRemoveTimerTimeout(saved.id);
    return saved;
  }

  async checkLevel(faucetId:number){
    const faucet = await this.findOne(faucetId);
    const nextLevel = faucet.level+1;
    const settings = getSettings(nextLevel);
    console.log(`clicks: ${faucet.clicks} required: ${settings.requiredClicks}`);
    if(faucet.clicks >= settings.requiredClicks){
      console.log(`here`);
      faucet.level = settings.level;
      await this.handfaucetRepository.save(faucet);
      return true;
    }
    return false;
  }

  async setTimeStart(faucetId:number){
    const faucet = await this.findOne(faucetId);
    const now = new Date();
    now.setMilliseconds(0);
    faucet.timerStart = now;
    return await this.handfaucetRepository.save(faucet);
  }

  async setRemoveVipDayStart(faucetId:number){
    const faucet = await this.findOne(faucetId);
    const now = new Date();
    now.setMilliseconds(0);
    faucet.vipRemoveDayStart = now;
    return await this.handfaucetRepository.save(faucet);
  }

  async removeTimeStart(faucetId:number){
    const faucet = await this.findOne(faucetId);
    faucet.timerStart = null;
    return await this.handfaucetRepository.save(faucet);
  }

  async removeTimerCallback(faucetId:number, name:string, milliseconds:number){
    const faucet = await this.findOne(faucetId);
    await this.removeTimeStart(faucet.id);
    this.schedulerRegistry.deleteTimeout(name);
    console.log(`Timeout ${name} executing after (${milliseconds})!`);
  }

  async addRemoveTimerTimeout(faucetId:number) {
    const faucet = await this.findOne(faucetId);
    const name = `${faucet.id}.removeHandFaucetTimeStart`;
    const milliseconds = faucet.timerAmount * 60000;
    const callback = async() => {
      await this.removeTimerCallback(faucet.id,name,milliseconds);
    };
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  async removeVipDayTimeoutCallback(faucetId:number, name:string){
    let faucet = await this.handfaucetRepository.findOneBy({id:faucetId});
    faucet.vipDays-=1;
    faucet = await this.handfaucetRepository.save(faucet);

    if(faucet.vipDays===0){
      await this.removeVip(faucet.id);
      const doesExist = this.schedulerRegistry.doesExist('timeout',name);
      if(doesExist){
        this.schedulerRegistry.deleteTimeout(name);
      }
      console.log('Vip is done!');
      return;
    }

    this.schedulerRegistry.deleteTimeout(name);

    await this.setRemoveVipDayStart(faucet.id);

    const callback = async()=>{
      await this.removeVipDayTimeoutCallback(faucet.id,name);
    }
    const nextMilliseconds = 60000;//one minute   потом поменять на 86400000 (1 день)...
    const nextTimeout = setTimeout(callback, nextMilliseconds);
    this.schedulerRegistry.addTimeout(name,nextTimeout);
    console.log(`VIP_Timeout ${name} set in (${nextMilliseconds})!`);
  }

  async addRemoveVipDayTimeout(faucetId:number){
    const faucet = await this.handfaucetRepository.findOneBy({id:faucetId});
    const name = `${faucet.id}.removeHandFaucetVipDay`;
    const milliseconds = 60000; //one minute   потом поменять на 86400000 (1 день)

    const callback = async() => {
      await this.removeVipDayTimeoutCallback(faucet.id,name);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

}
