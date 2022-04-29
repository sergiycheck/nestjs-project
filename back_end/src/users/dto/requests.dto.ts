import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsPropObjectId } from '../../article/dto/is-prop-objectid.validator';
import { UserUserName } from './create-user.dto';

export class IsUsernameAccessible extends UserUserName {
  // username for registration

  // for username change
  @IsOptional()
  @Validate(IsPropObjectId)
  @IsNotEmpty()
  public userId?: string;
}
