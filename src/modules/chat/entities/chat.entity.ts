import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ChatMessage } from '../dto/chat.dto';

@Entity()
export class ChatRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  kbId: string;

  @Column('text', {
    transformer: {
      to: (value) => JSON.stringify(value),
      from: (value) => {
        try {
          return JSON.parse(value);
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    },
  })
  messages: ChatMessage[];
}
