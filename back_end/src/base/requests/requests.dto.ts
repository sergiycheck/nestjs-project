import { IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';

export class PaginatedRequestDto {
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  @Reflect.metadata('limit', 5)
  public limit: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Reflect.metadata('skip', 0)
  public skip: number;
}

export const paginatedRequestPropsNames = {
  limit: 'limit',
  skip: 'skip',
};
