import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'Username can not be empty. Come up with a better username',
  })
  @IsString()
  @Length(4, 20)
  public username: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  public firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(4, 60)
  public lastName: string;
}
