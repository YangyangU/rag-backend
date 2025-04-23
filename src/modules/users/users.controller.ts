import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  LoginUserDto,
  GetUserListDto,
  DeleteUserDto,
  GetUserCountByDateDto,
} from './dto/users.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Post('getUserList')
  async getUserList(@Body() getUserListDto: GetUserListDto) {
    return await this.usersService.getUserList(getUserListDto);
  }

  @Post('deleteUser')
  async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    return await this.usersService.deleteUser(deleteUserDto);
  }

  @Post('getUserCountByDate')
  async getUserCountByDate(
    @Body() getUserCountByDateDto: GetUserCountByDateDto,
  ) {
    return await this.usersService.getUserCountByDate(getUserCountByDateDto);
  }
}
