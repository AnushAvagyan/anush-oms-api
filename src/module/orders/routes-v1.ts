import * as express from 'express';
import * as controller from './controller-v1.js';

const BASE_PATH = '/v1/orders';

export const router = express.Router();

router
  .route(BASE_PATH)
  .get(controller.listOrders)
  .post(controller.createOrder);

router
  .route(`${BASE_PATH}/:id`)
  .get(controller.getOrder)
  .delete(controller.deleteOrder)
  .patch(controller.updateOrder);
