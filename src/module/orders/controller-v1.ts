import { Request, Response } from 'express';
import * as orderService from './service.js';
import { ControllerError, RequestError, ResourceNotFoundError } from '../util/errors.js';
import { handleControllerError } from '../util/handle-error.js';
import * as validate from './validate.js';
import { ErrorResultX } from '../../models/common-v1.js';
import { getProduct, updateProduct } from '../products/repository.js';

/**
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function listOrders(req: Request, res: Response): Promise<void> {
  try {
    const input = validate.listOrdersReq(req);
    if ((input as ErrorResultX).errors !== void 0) {
      throw new ControllerError(input, {
        statusCode: 400,
      });
    }
    const orders = await orderService.listOrders();
    res.status(200).send(orders);
  } catch (err: any) {
    const message = 'Failed to list orders';
    handleControllerError(res, err, message);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function createOrder(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      body: { products, shipping, status },
    } = req;

    const input = validate.createOrderReq(req);
    if ((input as ErrorResultX).errors !== void 0) {
      throw new ControllerError(input, {
        statusCode: 400,
      });
    }
    if (!products.length) {
      throw new RequestError(
        'Order must have at least one product.'
      );
    }

    let limitedInventory: string | boolean = false;
  
    for (const product of products) {
      const  productData = await getProduct(product.id);
      if (productData.inventory < product.quantity) {
        console.warn({
          Name: 'Product is not available.',
          Body: { id: product.id, productStock: productData.inventory, orderQuantity : product.quantity },
        });
        limitedInventory =  `Product ${productData.name} is not available. Limited stock: only ${productData.inventory} products available.`
        break;
      }
      product.inventory = Number(productData.inventory )-Number(product.quantity )
    }
    if (limitedInventory) {
      throw new RequestError(limitedInventory);
    }
   
    const order = await orderService.createOrder({products, status});
    if (order && order.id) {
      for (const product of products) {
        await updateProduct({id: product.id, inventory: product.inventory})
      }
      if (shipping) {
        await orderService.updateOrder({
          id: order.id,
          shipping,
        });
      }
    }
    res.status(201).send(order);
  } catch (err: any) {
    const message = 'Failed to create order';
    handleControllerError(res, err, message);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function deleteOrder(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      params: { id },
    } = req;

    const input = validate.deleteOrderReq(req);
    if ((input as ErrorResultX).errors !== void 0) {
      throw new ControllerError(input, {
        statusCode: 400,
      });
    }
    // verify Order exists before delete
    let order;
    try {
      order = await orderService.getOrder(id);
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ControllerError(
          'The order you are trying to delete does not exist. Please provide a valid order id.',
          {
            statusCode: 404,
          }
        );
      }
    }
    console.info({
      Name: 'Input validation passed, deleting the order',
      Body: { order },
    });

    await orderService.deleteOrder(id);
    res.status(204).send();
  } catch (err: any) {
    const message = 'Failed to delete order';
    handleControllerError(res, err, message);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function getOrder(req: Request, res: Response): Promise<void> {
  try {
    const {
      params: { id },
    } = req;

    const input = validate.getOrder(req);
    if ((input as ErrorResultX).errors !== void 0) {
      throw new ControllerError(input, {
        statusCode: 400,
      });
    }

    const order = await orderService.getOrder(id);

    res.status(200).send(order);
  } catch (err: any) {
    handleControllerError(res, err, 'Failed to get order');
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function updateOrder(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      params: { id },
      body: { status, shipping },
    } = req;

    const input = validate.updateOrderReq(req);
    if ((input as ErrorResultX).errors !== void 0) {
      throw new ControllerError(input, {
        statusCode: 400,
      });
    }

    const order = await orderService.updateOrder({
      id,
      status,
      shipping,
    });
    res.status(200).send(order);
  } catch (err: any) {
    const message = 'Failed to update order.';
    handleControllerError(res, err, message);
  }
}
