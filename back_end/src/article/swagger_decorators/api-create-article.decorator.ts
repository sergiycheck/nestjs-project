import { Type, applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, getSchemaPath } from '@nestjs/swagger';
import { EndPointResponse } from '../../base/responses/response.dto';

export const ApiCreateArticleDecorator = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'article was created',
      schema: {
        title: `CreateArticleResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(EndPointResponse) },
          {
            properties: {
              data: {
                type: 'object',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
