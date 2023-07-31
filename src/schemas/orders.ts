import * as JsonSchema from '../module/util/json-schema.js';
import { AuthContext } from './common-v1.js';

export const CreateOrder = JsonSchema.object(
  {
    body: JsonSchema.object(
      {
        status: JsonSchema.string(),
        products: JsonSchema.array(
        JsonSchema.object(
          {
            id: JsonSchema.string(),
            quantity: JsonSchema.number(),
          },
          ['id', 'quantity']
        )),
        shipping: JsonSchema.object(
          {
            trackingCompany: JsonSchema.string(),
            trackingNumber: JsonSchema.string(),
          }
        ),
      },
      ['products']
    ),
    apiGateway: AuthContext,
  },
  ['body']
);

export const ListOrders = JsonSchema.object(
  {
    apiGateway: AuthContext,
  },
  []
);

export const GetOrder = JsonSchema.object(
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

export const DeleteOrder = JsonSchema.object(
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

export const UpdateOrder = JsonSchema.object(
  {
    params: JsonSchema.object(
      {
        id: JsonSchema.string(),
      },
      ['id']
    ),
    body: JsonSchema.object(
      {
        status: JsonSchema.string(),
        shipping: JsonSchema.object(
          {
            trackingCompany: JsonSchema.string(),
            trackingNumber: JsonSchema.string(),
          }
        ),
      },
      []
    ),
    apiGateway: AuthContext,
  },
  ['params', 'body']
);
