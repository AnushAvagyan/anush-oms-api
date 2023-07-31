import { Express } from 'express';

import { routes as healthRoutes } from './module/health/routes.js';
import { router as productsRouter } from './module/products/routes-v1.js';
import { router as ordersRouter } from './module/orders/routes-v1.js';

export function installRoutes(app: Express) {
  app.use(healthRoutes);
  app.use(productsRouter);
  app.use(ordersRouter);
}
