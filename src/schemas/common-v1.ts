import * as JsonSchema from '../module/util/json-schema.js';

export const Page = JsonSchema.number(1);

export const PageSize = JsonSchema.number(1);

export const ProductStatus = JsonSchema.string(['active', 'retired']);

export const AuthContext = JsonSchema.object(
  {
    event: JsonSchema.object(
      {
        requestContext: JsonSchema.object(
          {
          },
          []
        ),
      },
      []
    ),
  },
  ['event']
);
