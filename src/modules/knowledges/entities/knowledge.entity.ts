import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('knowledges')
export class Knowledge {
  @PrimaryColumn({ unique: true })
  kbId: string;

  @Column()
  kbName: string;

  @Column()
  type: 'quick' | 'normal';

  @Column()
  createTime: Date;

  //关联用户
  @Column()
  username: string;
}
