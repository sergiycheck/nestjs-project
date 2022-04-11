import { Request } from 'express';
import { User } from '../../users/entities/user.entity';
import { LeanDocument } from 'mongoose';

export type RequestWithUser = Request & { user: LeanDocument<User> };
