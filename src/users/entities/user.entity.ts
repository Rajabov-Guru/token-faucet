import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  CreateDateColumn, ManyToOne, OneToMany,
} from 'typeorm';
import { Balance } from '../../balances/entities/balance.entity';
import { Handfaucet } from '../../handfaucets/entities/handfaucet.entity';
import Token from '../../auth/entities/token.entity';
import { Autofaucet } from '../../autofaucets/entities/autofaucet.entity';

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

  @Column({default:10})
  rating: number;

  @Column({default:false})
  isReferal: boolean;

  @Column({default:false})
  isLoyal: boolean;

  @Column({default:1})
  level: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne((type) => User, (user) => user.referals)
  referer: User

  @OneToMany((type) => User, (user) => user.referer)
  referals: User[]

  @OneToOne(()=>Token,token=>token.user,{cascade:true })
  token: Token;

  @OneToOne(()=>Balance,balance => balance.user,{cascade:true })
  balance: Balance;

  @OneToOne(()=>Handfaucet,faucet=>faucet.user,{cascade:true })
  handfaucet: Handfaucet;

  @OneToOne(()=>Autofaucet,autofaucet=>autofaucet.user,{cascade:true })
  autofaucet: Autofaucet;

}