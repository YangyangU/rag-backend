import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, MoreThanOrEqual } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import {
  CreateUserDto,
  LoginUserDto,
  GetUserListDto,
  DeleteUserDto,
  GetUserCountByDateDto,
} from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // 通过注入用户实体的 repository
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const { username, password, role } = createUserDto;

    // 检查用户名是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException({
        code: 409,
        message: '用户名已存在',
        data: null,
      });
    }

    const user = this.usersRepository.create({
      username,
      password,
      role,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    });
    await this.usersRepository.save(user);
    return {
      code: 200,
      message: '注册成功',
      data: {
        username: user.username,
        role: user.role,
      },
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { username, password } = loginUserDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException({
        code: 401,
        message: '用户不存在',
        data: null,
      });
    }

    if (user.password !== password) {
      throw new UnauthorizedException({
        code: 401,
        message: '密码错误',
        data: null,
      });
    }

    user.updateTime = new Date().toISOString();
    await this.usersRepository.save(user);

    // 生成 JWT Token
    const payload = { username: user.username, role: user.role, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      code: 200,
      message: '登录成功',
      data: {
        accessToken: token,
        userInfo: {
          username: user.username,
          role: user.role,
        },
      },
    };
  }
  async getUserList(getUserListDto: GetUserListDto): Promise<any> {
    const { role, username } = getUserListDto;
    if (role === 'admin') {
      const users = await this.usersRepository.find({
        where: { username: Not(username) },
      });
      return {
        code: 200,
        message: '获取用户列表成功',
        data: users,
      };
    }
    return {
      code: 403,
      message: '无权访问用户列表',
    };
  }

  async deleteUser(deleteUserDto: DeleteUserDto): Promise<any> {
    const { usernameToDelete } = deleteUserDto;
    const user = await this.usersRepository.findOne({
      where: { username: usernameToDelete },
    });
    if (!user) {
      throw new UnauthorizedException({
        code: 401,
        message: '用户不存在',
        data: null,
      });
    }
    await this.usersRepository.delete(user.id);
    return {
      code: 200,
      message: '删除用户成功',
    };
  }
  async getUserCountByDate(
    getUserCountByDateDto: GetUserCountByDateDto,
  ): Promise<any> {
    const { role, date } = getUserCountByDateDto;
    if (role === 'admin') {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - date);
      const users = await this.usersRepository.find({
        where: {
          createTime: MoreThanOrEqual(startDate.toISOString()),
        },
      });
      // 按日期分组统计用户数量
      const dateCountMap = new Map<string, number>();
      users.forEach((user) => {
        const date = new Date(user.updateTime).toISOString().split('T')[0]; // 获取日期部分
        if (dateCountMap.has(date)) {
          dateCountMap.set(date, dateCountMap.get(date) ?? 0 + 1);
        } else {
          dateCountMap.set(date, 1);
        }
      });

      // 转换为指定格式
      const result = Array.from(dateCountMap).map(([name, value]) => ({
        name,
        value,
      }));

      return {
        code: 200,
        message: '获取用户数量成功',
        data: result,
      };
    }
    return {
      code: 403,
      message: '无权访问用户列表',
    };
  }
}
