import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // 通过注入用户实体的 repository
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const { username, password } = createUserDto;

    // 检查用户名是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    const user = this.usersRepository.create({
      username,
      password,
    });
    await this.usersRepository.save(user);
    return { message: '注册成功' };
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { username, password } = loginUserDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('密码错误');
    }

    // 生成 JWT Token
    const payload = { username: user.username, role: user.role, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { message: '登录成功', accessToken: token };
  }
}
