import { Product, ListProductsRes, ListCategoriesRes } from '../../models/products.js';
import { handleError } from '../util/handle-error.js';
import * as repo from './repository.js';

export async function listProducts(): Promise<ListProductsRes> {
  try {
    const result = await repo.listProducts();
    return result;
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function createProduct(params: {
  name: string;
  description?: string;
  inventory: number;
  price: number;
  categoryId: string;
  imageUrl?: string;
}): Promise<Product> {
  try {
    const { name, description, inventory, price, categoryId, imageUrl } = params;

    const productId = await repo.createProduct({
      name,
      description,
      inventory,
      price,
      categoryId,
      imageUrl,
    });

    const product = await repo.getProduct(productId);

    return product;
  } catch (err: any) {
    throw handleError(err);
  }
}

/**
 * Get a product
 * @param {string} id ID of the Product
 * @return {Promise<Product>}
 */
export async function getProduct(id: string): Promise<Product> {
  try {
    const Product = await repo.getProduct(id);
    return Product;
  } catch (err: any) {
    throw handleError(err);
  }
}

/**
 * Delete a product
 * @param id ID of the Product
 * @return {Promise<void>}
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    await repo.deleteProduct(id);
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function updateProduct(params: {
  id: string;
  name?: string;
  description?: string;
  inventory?: number;
  price?: number;
  categoryId?: string;
  imageUrl?: string;
}): Promise<Product> {
  try {
    const { id, name, description, inventory, price, categoryId, imageUrl } = params;
    await repo.updateProduct({
      id,
      name,
      description,
      inventory,
      price,
      categoryId,
      imageUrl,
    });

    const product = await repo.getProduct(id);
    return product;
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function getCategories(): Promise<ListCategoriesRes> {
  try {
    const result = await repo.getCategories();
    return result;
  } catch (err: any) {
    throw handleError(err);
  }
}
