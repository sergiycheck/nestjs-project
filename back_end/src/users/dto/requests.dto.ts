import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsPropObjectId } from '../../article/dto/is-prop-objectid.validator';
import { UserUserName } from './create-user.dto';

export class IsUsernameAccessible extends UserUserName {
  @IsOptional()
  @Validate(IsPropObjectId)
  @IsNotEmpty()
  public userId?: string;
}
