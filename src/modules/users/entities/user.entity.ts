import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // 定义与数据库的表对应
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: 'admin' | 'user';
}
