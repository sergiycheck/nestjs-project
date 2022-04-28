import { Length, IsNotEmpty, IsString } from 'class-validator';

export class UserUserName {
  @IsNotEmpty({
    message: 'Username can not be empty. Come up with a better username',
  })
  @IsString()
  @Length(4, 20)
  public username: string;
}

export class CreateUserDto extends UserUserName {
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 60)
  public lastName: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  public password: string;
}
