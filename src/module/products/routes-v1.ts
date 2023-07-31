import express from 'express';
import * as controller from './controller-v1.js';

const BASE_PATH = '/v1/products';

export const router = express.Router();

router
  .route(BASE_PATH)
  .get(controller.listProducts)
  .post(controller.createProduct);

router
  .route(`${BASE_PATH}/:id`)
  .get(controller.getProduct)
  .delete(controller.deleteProduct)
  .patch(controller.updateProduct);

  router
  .route(`/v1/categories`)
  .get(controller.getCategories)
