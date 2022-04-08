import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

export type RequestWithUser = Request & { user: User };
