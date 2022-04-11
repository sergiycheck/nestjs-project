import { IsJWT, IsNotEmpty, IsString } from 'class-validator';
import { MappedUserResponse } from '../../users/dto/response-user.dto';
import { BaseEntity } from '../../base/entities/base-entities';

export class UserLoginResponse extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsNotEmpty()
  userResponse: MappedUserResponse;

  @IsNotEmpty()
  @IsJWT()
  public user_jwt: string;
}
