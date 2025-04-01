import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Knowledge')
export class Knowledge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  kbId: string;

  @Column()
  kbName: string;

  @Column()
  type: string;

  @Column()
  createTime: Date;

  //关联用户
  @Column()
  username: string;
}
