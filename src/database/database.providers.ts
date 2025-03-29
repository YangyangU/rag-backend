import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      return new DataSource({
        type: 'mysql', // 数据库类型
        host: process.env.DB_HOST, // 数据库主机
        port: 3306, // 数据库端口
        username: process.env.DB_USERNAME, // 数据库用户名
        password: process.env.DB_PASSWORD, // 数据库密码
        database: process.env.DB_NAME, // 数据库名
        entities: [User], // 注册所有实体
        synchronize: true, // 开发环境中可开启自动同步数据库（生产环境中应关闭）
      }).initialize();
    },
  },
];
