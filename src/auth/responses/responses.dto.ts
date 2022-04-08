import { IsJWT, IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from '../../base/entities/base-entities';

export class UserLoginResponse extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsNotEmpty()
  @IsJWT()
  public user_jwt: string;
}
