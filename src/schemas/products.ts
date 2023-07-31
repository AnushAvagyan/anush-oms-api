import * as JsonSchema from '../module/util/json-schema.js';
import { AuthContext } from './common-v1.js';

export const CreateProduct = JsonSchema.object(
  {
    body: JsonSchema.object(
      {
        name: JsonSchema.string(),
        description: JsonSchema.string(),
        inventory: JsonSchema.number(),
        price: JsonSchema.number(),
        categoryId: JsonSchema.string(),
      },
      ['name', 'inventory', 'price']
    ),
    apiGateway: AuthContext,
  },
  ['body']
);

export const ListProducts = JsonSchema.object(
  {
    apiGateway: AuthContext,
  },
  []
);

export const GetProduct = JsonSchema.object(
  {
    params: JsonSchema.object(
      {
        id: JsonSchema.string(),
      },
      ['id']
    ),
    apiGateway: AuthContext,
  },
  ['params']
);

export const DeleteProduct = JsonSchema.object(
  {
    params: JsonSchema.object(
      {
        id: JsonSchema.string(),
      },
      ['id']
    ),
    apiGateway: AuthContext,
  },
  ['params']
);

export const UpdateProduct = JsonSchema.object(
  {
    params: JsonSchema.object(
      {
        id: JsonSchema.string(),
      },
      ['id']
    ),
    body: JsonSchema.object(
      {
        name: JsonSchema.string(),
        description: JsonSchema.string(),
        inventory: JsonSchema.number(),
        categoryId: JsonSchema.string(),
        price: JsonSchema.number(),
      },
      []
    ),
    apiGateway: AuthContext,
  },
  ['params', 'body']
);
