import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Bot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  botId: string;

  @Column()
  botName: string;

  @Column()
  introduction: string;

  @Column()
  avatar: string;

  @Column()
  username: string;

  @Column('simple-array')
  kbIds: string[];
}
