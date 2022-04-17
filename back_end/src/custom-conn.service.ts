import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class CustomConnectionService {
  constructor(@InjectConnection() private connection: Connection) {}

  getConnection() {
    return this.connection;
  }
}
