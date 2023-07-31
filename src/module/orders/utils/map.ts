import { DbOrder, Order } from '../../../models/orders.js';

export function dbToServiceOrder(order: DbOrder): Order {
  return {
    id: order.id,
    status: order.status,
    products: order.products,
    trackingCompany: order.tracking_company,
    trackingNumber: order.tracking_number,
    updated: typeof order.updated === 'string' ? order.updated : order.updated?.toJSON(),
    created: typeof order.created === 'string' ? order.created : order.created?.toJSON(),
  };
}
