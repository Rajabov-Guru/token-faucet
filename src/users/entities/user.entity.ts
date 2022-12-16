import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Bonus } from '../../bonuses/entities/bonus.entity';
import { Balance } from '../../balances/entities/balance.entity';
import { Handfaucet } from '../../handfaucets/entities/handfaucet.entity';
import Token from '../../auth/entities/token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique:true})
  login: string;

  @Column({unique:true})
  email: string;

  @Column()
  password: string;

  @Column()
  secret: number;

  @Column({default:0})
  rating: number;

  @Column({default:false})
  isRef: boolean;

  @Column({default:1})
  level: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(()=>Token,token=>token.user,{cascade:true })
  token: Token;

  @OneToOne(()=>Balance,balance => balance.user,{cascade:true })
  balance: Balance;

  @OneToOne(()=>Handfaucet,faucet=>faucet.user,{cascade:true })
  handfaucet: Handfaucet;

  @ManyToMany(() => Bonus,{cascade:true })
  bonuses: Bonus[]

}