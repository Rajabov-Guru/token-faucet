import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Bonus {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  name:string;

  @Column({default:0})
  value:number;

  @Column({default:0})
  clicks:number;

  @Column()
  isConst:boolean;

  @ManyToMany(() => User,{onDelete:'CASCADE' })
  @JoinTable()
  users: User[]
}
