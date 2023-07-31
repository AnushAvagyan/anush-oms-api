import {
  ListCategoriesRes,
  ListProductsRes,
  Product,
  ProductDBRecord,
} from '../../models/products.js';
import pool from '../../pool.js'
import { ResourceNotFoundError } from '../util/errors.js';
import { handleError } from '../util/handle-error.js';
import { QueryBuilder } from '../util/query-builder.js';
import { dbToServiceProduct } from './utils/map.js';

const UPDATE_FIELDS = {
  name: 'name',
  description: 'description',
  price: 'price',
  inventory: 'inventory',
  category_id: 'categoryId',
  imageUrl: 'imageUrl',
} as const;

export async function listProducts(): Promise<ListProductsRes> {
  try {
    const queryText = `SELECT
    products.id,
    products.name,
    products.description,
    products.inventory,
    products.price,
    products.created,
    products.updated,
    products.category_id,
    (SELECT name
      FROM categories WHERE categories.id = products.category_id
    ) AS category
    FROM products WHERE products.status = 'active'`;

    const dbResponse = await pool.query({
      text: queryText,
    });

    return {
      items: dbResponse.rows.map((product: ProductDBRecord) => dbToServiceProduct(product)),
    };
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function getCategories(): Promise<ListCategoriesRes> {
  try {
    const queryText = `SELECT id, name FROM categories;`;

    const dbResponse = await pool.query({
      text: queryText,
    });

    return {
      items: dbResponse.rows,
    };
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function createProduct(params: {
  name: string;
  description?: string;
  inventory: number;
  price: number;
  categoryId?: string;
  imageUrl?: string,
}): Promise<string> {
  try {
    console.info({
      Name: 'Querying database',
      Body: params,
    });

    const { name, description, inventory, price, categoryId, imageUrl } = params;

    const queryBuilder = new QueryBuilder();

    queryBuilder
      .insert()
      .into('products')
      .columns('name', 'description', 'inventory', 'price', 'category_id', 'image_url', 'status')
      .values(name, description, inventory, price, categoryId, imageUrl, 'active')
      .returning('id');

    const dbResponse = await pool.query(
      queryBuilder.build()
    );
    const { id } = dbResponse.rows[0];
    console.info({
      Name: 'Product created.',
      Body: { id },
    });

    return id;
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function getProduct(id: string): Promise<Product> {
  try {
    console.info({
      Name: 'Fetching product by id.',
      Body: { id },
    });

    const queryText = `SELECT
      products.id,
      products.name,
      products.description,
      products.inventory,
      products.price,
      products.created,
      products.updated,
      products.category_id,
      (SELECT name
        FROM categories WHERE categories.id = products.category_id
      ) AS category
      FROM products
      WHERE products.status = 'active' AND products.id = $1`;
    const values = [id];
    const dbResponse = await pool.query({
      text: queryText,
      values,
    });

    if (dbResponse.rows.length < 1) {
      throw new ResourceNotFoundError('Product not found');
    }

    return dbToServiceProduct(dbResponse.rows[0]);
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    console.info({
      Name: 'Deleting Product',
      Body: { id },
    });
    const dbResponse = await pool.query({
      text: `UPDATE products set status = 'retired' WHERE id = $1;`,
      values: [id],
    });
    console.info({
      Name: 'Product deleted.',
      Body: { id, deletedRows: dbResponse.rowCount },
    });
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
}): Promise<void> {
  try {
    const { id } = params;
    console.info({
      Name: 'Updating Product.',
      Body: { id },
    });

    const values: Array<string | number> = [id];
    const columns: string[] = [];
    const val: Array<string | number> = [];
    let paramIndex = 2; // $1 = id, $2 = ...

    for (const [field, columnName] of Object.entries(UPDATE_FIELDS)) {
      const param = params[columnName];
      if (param !== undefined) {
        columns.push(field);
        val.push(`$${paramIndex}`);
        values.push(param);
        paramIndex++;
      }
    }
    if (columns.length) {
      const colFrag =
        columns.length > 1 ? `(${columns.join(',')})` : columns[0];
      const valFrag = val.length > 1 ? `(${val.join(',')})` : val[0];

      const text = `UPDATE products set ${colFrag} = ${valFrag} WHERE id = $1;`;
      const dbResponse = await pool.query({ text, values });
      console.info({
        Name: 'Product updated.',
        Body: { id, updatedRows: dbResponse.rowCount },
      });
    }
  } catch (err: any) {
    let error = err;
    throw handleError(error);
  }
}
