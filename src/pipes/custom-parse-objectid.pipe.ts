import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class CustomParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const ObjectId = mongoose.Types.ObjectId;
    if (!ObjectId.isValid(value))
      throw new BadRequestException(`value is not an objectId`);
    return value;
  }
}
