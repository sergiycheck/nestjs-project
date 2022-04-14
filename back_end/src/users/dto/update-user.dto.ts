import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { PartialType as MappedPartial } from '@nestjs/mapped-types';

export class UpdateUserDto extends MappedPartial(PartialType(CreateUserDto)) {}
