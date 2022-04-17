import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../entities/base-entities';

export class EndPointResponse<T> extends BaseEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public message: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  public data?: T;
}
