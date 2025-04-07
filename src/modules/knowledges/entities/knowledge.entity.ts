import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('knowledges')
export class Knowledge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  kbId: string;

  @Column()
  kbName: string;

  @Column()
  type: 'quick' | 'faq' | 'normal';

  @Column()
  createTime: Date;

  //关联用户
  @Column()
  username: string;
}
