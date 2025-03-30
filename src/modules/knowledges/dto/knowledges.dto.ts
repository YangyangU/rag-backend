export class CreateUserDto {
  kbTitle: string;
  kbContent: string;
  role?: 'admin' | 'user' = 'user';
}

export class LoginUserDto {
  username: string;
  password: string;
}
