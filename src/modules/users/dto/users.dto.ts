export class CreateUserDto {
  username: string;
  password: string;
  role?: 'admin' | 'user' = 'user';
}

export class LoginUserDto {
  username: string;
  password: string;
}
