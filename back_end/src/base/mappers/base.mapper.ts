export class BaseMapper {
  // we have to stringify and parse because we can not map array of buffer Object ids

  protected getConvertedFromJson<T>(entity: T) {
    return JSON.parse(JSON.stringify(entity));
  }
}
