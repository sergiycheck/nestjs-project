import { Request } from 'express';
import { MappedUserResponse } from '../../users/dto/response-user.dto';

export type RequestWithUser = Request & { user: MappedUserResponse };
