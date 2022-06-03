import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseFilters,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/metadata.decorators';
import { CustomParseObjectIdPipe } from '../pipes/custom-parse-objectid.pipe';
import { UsersEndpoint } from '../api/endpoints';
import {
  isUsernameAccessible,
  MappedUserResponse,
  MappedUserResponseWithRelations,
  UserDeleteResult,
} from './dto/response-user.dto';
import { BaseController } from '../base/controllers/base.controller';
import { CanUserManageUserGuard } from './can-user-manage-user.guard';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { PaginatedRequestDto } from '../base/requests/requests.dto';
import { PaginatedResponseDto } from '../base/responses/response.dto';
import { IsUsernameAccessible } from './dto/requests.dto';
import { UsernameIsNotAccessibleFilter } from './filters/users.filters';
import { AuthService } from './../auth/auth.service';
import { Response } from 'express';

// TODO: remove. only for testing
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

@ApiTags(UsersEndpoint)
@Controller(UsersEndpoint)
export class UsersController extends BaseController {
  constructor(private readonly usersService: UsersService, private authService: AuthService) {
    super();
  }

  @Public()
  @Post()
  async create(@Body() createCatDto: CreateUserDto) {
    const res = await this.usersService.create(createCatDto);

    return this.getResponse<MappedUserResponse>('user was created', 'user was not created', res);
  }

  @Public()
  @Get('with-relations')
  async findAllWithRelations() {
    const res = await this.usersService.findAlWithRelations();
    return this.getResponse<MappedUserResponseWithRelations[]>(
      'users were found',
      'no users were found',
      res,
    );
  }

  @Public()
  @Get()
  async findAll(@Query() query: PaginatedRequestDto) {
    const res = await this.usersService.findAll(query);
    await sleep(1000);
    return this.getResponse<PaginatedResponseDto<MappedUserResponse[]>>(
      'users were found',
      'no users were found',
      res,
    );
  }

  @Public()
  @Get('by-username')
  async findOneByUsername(@Query('username') username: string) {
    const user = await this.usersService.findOneUserByUsername(username);

    return this.getResponse<MappedUserResponse>(
      'user was found',
      `user was not found for username ${username}`,
      user,
    );
  }

  @UseFilters(UsernameIsNotAccessibleFilter)
  @Public()
  @Get('is-username-accessible')
  async checkIfUserNameAccessible(@Query() query: IsUsernameAccessible) {
    const { username, userId } = query;
    const isAccessible = await this.usersService.countUsername(username, userId);

    return new isUsernameAccessible({ isAccessible });
  }

  @Public()
  @Get('with-relations/:id')
  async findOneWithRelations(@Param('id', new CustomParseObjectIdPipe()) id: string) {
    const user = await this.usersService.findOneWithRelations(id);
    return this.getResponse<MappedUserResponseWithRelations>(
      'user was found',
      `user was not found for id ${id}`,
      user,
    );
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', new CustomParseObjectIdPipe()) id: string) {
    const user = await this.usersService.findByIdWithRelationsIds(id);
    return this.getResponse<MappedUserResponse>(
      'user was found',
      `user was not found for id ${id}`,
      user,
    );
  }

  @ApiCookieAuth()
  @UseGuards(new CanUserManageUserGuard())
  @Patch(':id')
  async update(
    @Param('id', new CustomParseObjectIdPipe()) id: string,
    @Body() updateDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    const mappedUserResponse = await this.usersService.update(id, updateDto);

    const { username } = mappedUserResponse;

    const { refreshCookieValue } = this.authService.getRefreshTokenAndCookieWithIt(username, id);

    const { access_token, authCookieValue } = this.authService.getAuthTokenWithItsCookie({
      username,
      sub: id,
    });

    response.setHeader('Set-Cookie', [authCookieValue, refreshCookieValue]);

    const mappedResponse = this.getResponse<{
      mappedUserResponse: MappedUserResponse;
      access_token: string;
    }>('user was updated successfully', 'fail to update the user', {
      access_token,
      mappedUserResponse,
    });

    response.status(201).json(mappedResponse);
  }

  @ApiCookieAuth()
  @UseGuards(new CanUserManageUserGuard())
  @Delete(':id')
  async remove(@Param('id', new CustomParseObjectIdPipe()) id: string, @Res() response: Response) {
    const res = await this.usersService.remove(id);

    await this.authService.usersService.removeRefreshToken(id);

    const logOutCookies = this.authService.getCookiesForLogOut();

    response.setHeader('Set-Cookie', [...logOutCookies]);

    const mappedResponse = this.getResponse<UserDeleteResult>(
      'user was deleted successfully',
      'fail to delete the user',
      res,
    );

    response.status(200).json(mappedResponse);
  }
}
