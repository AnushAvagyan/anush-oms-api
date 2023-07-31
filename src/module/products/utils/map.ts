import { ProductDBRecord, Product } from '../../../models/products.js';

export function dbToServiceProduct(product: ProductDBRecord): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    updated: product.updated?.toJSON(),
    created: product.created?.toJSON(),
    price: product.price,
    inventory: product.inventory,
    categoryId: product.category_id,
    category: product.category,
    imageUrl: product.image_url,
    thumbnail: product.thumbnail,
  };
}
