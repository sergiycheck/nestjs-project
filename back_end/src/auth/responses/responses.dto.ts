import {
  IsBoolean,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { MappedUserResponse } from '../../users/dto/response-user.dto';
import { BaseEntity } from '../../base/entities/base-entities';

export class UserAuthResponse extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsNotEmpty()
  @IsBoolean()
  public successfulAuth: boolean;

  @IsOptional()
  @IsNotEmpty()
  userResponse: MappedUserResponse;
}

export class UserLoginResponse extends UserAuthResponse {
  @IsOptional()
  @IsNotEmpty()
  @IsJWT()
  public user_jwt: string;
}
