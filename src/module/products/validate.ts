import * as validate from '../util/validate-express.js';
import * as schema from '../../schemas/products.js';
import {
  ListProducts,
  GetProduct,
  CreateProduct,
  DeleteProduct,
  UpdateProduct,
} from '../../models/products.js';

export const getProduct = validate.generate<GetProduct>(schema.GetProduct);

export const createProductReq = validate.generate<CreateProduct>(
  schema.CreateProduct
);

export const listProductsReq = validate.generate<ListProducts>(
  schema.ListProducts
);

export const deleteProductReq = validate.generate<DeleteProduct>(
  schema.DeleteProduct
);

export const updateProductReq = validate.generate<UpdateProduct>(
  schema.UpdateProduct
);
