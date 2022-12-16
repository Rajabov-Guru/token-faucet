import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Handfaucet } from './entities/handfaucet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HandfaucetsService {

  constructor(@InjectRepository(Handfaucet) private readonly handfaucetRepository:Repository<Handfaucet>) {
  }

  async create() {
    const newFaucet = await this.handfaucetRepository.create();
    return this.handfaucetRepository.save(newFaucet);
  }

  findAll() {
    return this.handfaucetRepository.find();
  }

  findOne(id: number) {
    return this.handfaucetRepository.findOneBy({id});
  }

  save(handfaucet:Handfaucet){
    return this.handfaucetRepository.save(handfaucet);
  }

  async addTokens(id:number, tokens:number){
    const handfaucet = await this.handfaucetRepository.findOneBy({id});
    handfaucet.tokens += tokens;
    handfaucet.clicks+=1;
    return this.handfaucetRepository.save(handfaucet);
  }

}
