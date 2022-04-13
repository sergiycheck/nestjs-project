export class BaseMapper {
  protected getConvertedFromJson<T>(entity: T) {
    return JSON.parse(JSON.stringify(entity));
  }
}
