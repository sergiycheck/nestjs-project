import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../entities/base-entities';

export class EndPointResponse<T> extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsOptional()
  @IsNotEmpty()
  public data?: T;
}
