import * as validate from '../util/validate-express.js';
import * as schema from '../../schemas/orders.js';
import {
  ListOrders,
  GetOrder,
  CreateOrder,
  DeleteOrder,
  UpdateOrder,
} from '../../models/orders.js';

export const getOrder = validate.generate<GetOrder>(schema.GetOrder);

export const createOrderReq = validate.generate<CreateOrder>(
  schema.CreateOrder
);

export const listOrdersReq = validate.generate<ListOrders>(
  schema.ListOrders
);

export const deleteOrderReq = validate.generate<DeleteOrder>(
  schema.DeleteOrder
);

export const updateOrderReq = validate.generate<UpdateOrder>(
  schema.UpdateOrder
);
