import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:0})
  tokens:number;

  @Column({default:0})
  satoshi:number;

  @Column({default:0})
  experience:number;

  @Column({default:0})
  energy:number;

  @Column({default:0})
  clicks:number;

  @OneToOne(()=>User, book => book.balance,)
  @JoinColumn()
  user: User;

}
