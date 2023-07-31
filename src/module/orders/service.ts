import { Order, ListOrdersRes } from '../../models/orders.js';
import { handleError } from '../util/handle-error.js';
import * as repo from './repository.js';

export async function listOrders(): Promise<ListOrdersRes> {
  try {
    const result = await repo.listOrders();
    return result;
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function createOrder(params: {
  products: {
    id: string;
    quantity: number;
  }[];
  status?: string;
}): Promise<Order> {
  try {
    const { products, status} = params;
    const orderId = await repo.createOrder({products, status});
    const order = await repo.getOrder(orderId);

    return order;
  } catch (err: any) {
    throw handleError(err);
  }
}

/**
 * Get an order
 * @param {string} id ID of the order
 * @return {Promise<Order>}
 */
export async function getOrder(id: string): Promise<Order> {
  try {
    const order = await repo.getOrder(id);
    return order;
  } catch (err: any) {
    throw handleError(err);
  }
}

/**
 * Delete a Order
 * @param id ID of the Order
 * @return {Promise<void>}
 */
export async function deleteOrder(id: string): Promise<void> {
  try {
    await repo.deleteOrder(id);
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function updateOrder(params: {
  id: string;
  status?: string;
  shipping?: {
    trackingCompany?: string;
    trackingNumber?: string;
  };
}): Promise<Order> {
  try {
    const { id, status, shipping} = params;
    await repo.updateOrder({
      id,
      status,
      shipping,
    });

    const order = await repo.getOrder(id);
    return order;
  } catch (err: any) {
    throw handleError(err);
  }
}
