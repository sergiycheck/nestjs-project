import mongoose from 'mongoose';

export type ToObjectContainingQuery<T> = {
  toObject: (args: mongoose.ToObjectOptions) => mongoose.LeanDocument<T>;
};

export class BaseService {
  protected queryToObj<T>(query: ToObjectContainingQuery<T>) {
    return query.toObject({
      getters: true,
      virtuals: true,
      versionKey: false,
      flattenMaps: true,
    });
  }
}
