import { Request, Response } from 'express';
import * as productService from './service.js';
import { ControllerError, ResourceNotFoundError } from '../util/errors.js';
import { handleControllerError } from '../util/handle-error.js';
import * as validate from './validate.js';
import { ErrorResultX } from '../../models/common-v1.js';

/**
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function listProducts(req: Request, res: Response): Promise<void> {
  try {
    const input = validate.listProductsReq(req);
    if ((input as ErrorResultX).errors !== void 0) {
      throw new ControllerError(input, {
        statusCode: 400,
      });
    }
    const products = await productService.listProducts();
    res.status(200).send(products);
  } catch (err: any) {
    const message = 'Failed to list Products';
    handleControllerError(res, err, message);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function createProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      body: { name, description, inventory, price, categoryId, imageUrl },
    } = req;

    const input = validate.createProductReq(req);
    if ((input as ErrorResultX).errors !== void 0) {
      throw new ControllerError(input, {
        statusCode: 400,
      });
    }

    let thumbnail;
    if (imageUrl) {
      //generate thumbnail
    }

    const product = await productService.createProduct({
      name: name as string,
      description: description as string,
      inventory,
      price,
      categoryId,
      imageUrl,
    });
    res.status(201).send(product);
  } catch (err: any) {
    const message = 'Failed to create product';
    handleControllerError(res, err, message);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function deleteProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      params: { id },
    } = req;

    const input = validate.deleteProductReq(req);
    if ((input as ErrorResultX).errors !== void 0) {
      throw new ControllerError(input, {
        statusCode: 400,
      });
    }
    // verify product exists before delete
    let product;
    try {
      product = await productService.getProduct(id);
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ControllerError(
          'The product you are trying to delete does not exist. Please provide a valid product id.',
          {
            statusCode: 404,
          }
        );
      }
    }
    console.info({
      Name: 'Input validation passed, deleting the product',
      Body: { product },
    });

    await productService.deleteProduct(id);
    res.status(204).send();
  } catch (err: any) {
    const message = 'Failed to delete product';
    handleControllerError(res, err, message);
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function getProduct(req: Request, res: Response): Promise<void> {
  try {
    const {
      params: { id },
    } = req;

    const input = validate.getProduct(req);
    if ((input as ErrorResultX).errors !== void 0) {
      throw new ControllerError(input, {
        statusCode: 400,
      });
    }

    const product = await productService.getProduct(id);

    res.status(200).send(product);
  } catch (err: any) {
    handleControllerError(res, err, 'Failed to get product');
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
export async function updateProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      params: { id },
      body: { name, description, price, inventory, categoryId, imageUrl },
    } = req;

    const input = validate.updateProductReq(req);
    if ((input as ErrorResultX).errors !== void 0) {
      throw new ControllerError(input, {
        statusCode: 400,
      });
    }

    const Product = await productService.updateProduct({
      id,
      name,
      description,
      price,
      inventory,
      categoryId,
      imageUrl,
    });
    res.status(200).send(Product);
  } catch (err: any) {
    const message = 'Failed to update product.';
    handleControllerError(res, err, message);
  }
}

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const input = validate.listProductsReq(req);
    if ((input as ErrorResultX).errors !== void 0) {
      throw new ControllerError(input, {
        statusCode: 400,
      });
    }
    const categories = await productService.getCategories();
    res.status(200).send(categories);
  } catch (err: any) {
    const message = 'Failed to list categories';
    handleControllerError(res, err, message);
  }
}
