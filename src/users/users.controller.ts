import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/metadata.decorators';
import { CustomParseObjectIdPipe } from 'src/pipes/custom-parse-objectid.pipe';
import { UsersEndpoint } from 'src/api/endpoints';

@Public()
@Controller(UsersEndpoint)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createCatDto: CreateUserDto) {
    return this.usersService.create(createCatDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('by-username')
  async findOneByUsername(@Query('username') username: string) {
    const user = await this.usersService.findOneUserByUsername(username);
    return user;
  }

  @Get(':id')
  async findOne(@Param('id', new CustomParseObjectIdPipe()) id: string) {
    const user = await this.usersService.findOneWithRelations(id);
    return user;
  }

  @Patch(':id')
  update(
    @Param('id', new CustomParseObjectIdPipe()) id: string,
    @Body() updateCatDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id', new CustomParseObjectIdPipe()) id: string) {
    return this.usersService.remove(id);
  }
}
