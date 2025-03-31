import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('knowledges') // 定义与数据库的表对应
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  kb_id: string;

  @Column()
  kb_name: string;

  @Column()
  type: string;

  @Column()
  createTime: Date;
}
