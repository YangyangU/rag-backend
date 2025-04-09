import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalName: string;

  @Column()
  fileName: string; // 存储的文件名

  @Column()
  filePath: string; // 文件存储路径

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  kbId: string;
}
