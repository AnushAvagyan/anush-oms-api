import express from 'express';
import * as controller from './controller.js';

export const routes = express.Router();

routes.route('/health').get(controller.checkHealth);
