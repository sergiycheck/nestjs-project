import { InternalServerErrorException } from '@nestjs/common';
import mongoose from 'mongoose';

export type ToObjectContainingQuery<T> = {
  toObject: (args: mongoose.ToObjectOptions) => mongoose.LeanDocument<T>;
};

export class BaseService {
  protected queryToObj<T>(query: ToObjectContainingQuery<T>) {
    if (!query)
      throw new InternalServerErrorException(
        'query was not provided for calling toObject method',
      );

    return query.toObject({
      getters: true,
      virtuals: true,
      versionKey: false,
      flattenMaps: true,
    });
  }
}
