export class CreateUserDto {
  username: string;
  password: string;
  role?: 'admin' | 'user';
}

export class LoginUserDto {
  username: string;
  password: string;
}

export class GetUserListDto {
  username: string;
  password: string;
  role?: 'admin' | 'user';
}

export class DeleteUserDto {
  username: string;
  role?: 'admin' | 'user';
  usernameToDelete: string;
}

export class GetUserCountByDateDto {
  role?: 'admin' | 'user';
  date: number;
}
