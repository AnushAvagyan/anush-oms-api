import {DbOrder, ListOrdersRes, Order} from '../../models/orders.js';
import pool from '../../pool.js'
import { ResourceNotFoundError } from '../util/errors.js';
import { handleError } from '../util/handle-error.js';
import { QueryBuilder } from '../util/query-builder.js';
import { dbToServiceOrder } from './utils/map.js';


export async function listOrders(): Promise<ListOrdersRes> {
  try {
    const queryText = `SELECT
    orders.id,
    orders.status,
    (SELECT json_agg(product) as oproducts
      FROM (
        SELECT
          p.id,
          p.name,
          p.description,
          p.price,
          oproducts.quantity,
          (SELECT name
            FROM categories WHERE categories.id = p.category_id
          ) AS category
        FROM orderproducts AS oproducts
        LEFT JOIN products p ON oproducts.product_id = p.id
        WHERE orders.id = oproducts.order_id
      ) product
    ) AS products,
    orders.created,
    orders.updated,
    shipments.tracking_company,
    shipments.tracking_number
    FROM orders
    LEFT JOIN shipments on shipments.order_id = orders.id`;

    const dbResponse = await pool.query({
      text: queryText,
    });

    return {
      items: dbResponse.rows.map((order: DbOrder) => dbToServiceOrder(order)),
    };
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function createOrder(params: {
  products: {
    id: string,
    quantity: number;
  }[];
  status?: string;
}): Promise<string> {
  try {
    const { products, status } = params;
    console.info({
      Name: 'Querying database',
      Body: products,
    });

    const queryBuilder = new QueryBuilder();

    queryBuilder
      .insert()
      .into('orders')
      .columns('status')
      .values(status)
      .returning('id');

    const dbResponse = await pool.query(
      queryBuilder.build()
    );
    const { id } = dbResponse.rows[0];
    console.info({
      Name: 'Order created. Adding products to the order',
      Body: { id },
    });

        // add products to the created order
        try {
          let values = '';
          products.forEach((product, i) => {
            if (i === products.length - 1) {
              values += `('${id}', '${product.id}', ${product.quantity})`;
            } else {
              values += `('${id}', '${product.id}', ${product.quantity}),`;
            }
          });
          const queryText = `INSERT INTO orderproducts (order_id, product_id, quantity) VALUES ${values};`;
          await pool.query({
            text: queryText,
          });
        } catch (err: any) {
          // rollback order if adding products to the order failed
          await pool.query({
            text: 'DELETE FROM orders WHERE id = $1;',
            values: [id],
          });
          console.info({
            Name: 'Failed to add products to an order. Order deleted.',
            Body: {id},
          });
          throw err;
        }
        console.info({
          Name: 'Order created.',
          Body: {id},
        });
        return id;
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function getOrder(id: string): Promise<Order> {
  try {
    console.info({
      Name: 'Fetching order by id.',
      Body: { id },
    });

    const queryText = `SELECT
    orders.id,
    orders.status,
    (SELECT json_agg(product) as oproducts
      FROM (
        SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        oproducts.quantity,
        (SELECT name
          FROM categories WHERE categories.id = p.category_id
        ) AS category
        FROM orderproducts AS oproducts
        LEFT JOIN products p ON oproducts.product_id = p.id
        WHERE orders.id = oproducts.order_id
      ) product
    ) AS products,
    orders.created,
    orders.updated,
    shipments.tracking_company,
    shipments.tracking_number
    FROM orders
    LEFT JOIN shipments on shipments.order_id = orders.id
    WHERE orders.id = $1`;
    const values = [id];
    const dbResponse = await pool.query({
      text: queryText,
      values,
    });

    if (dbResponse.rows.length < 1) {
      throw new ResourceNotFoundError('Order not found');
    }

    return dbToServiceOrder(dbResponse.rows[0]);
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    console.info({
      Name: 'Deleting Order',
      Body: { id },
    });

    const dbResponse = await pool.query({
      text: 'DELETE FROM orders WHERE id = $1;',
      values: [id],
    });
    // the bellow records should be taken care of by FOREIGN KEY with ON DELETE CASCADE
    // await pool.query({
    //   text: 'DELETE FROM orderproducts WHERE order_id = $1;',
    //   values: [id],
    // });
    // await pool.query({
    //   text: 'DELETE FROM shipments WHERE order_id = $1;',
    //   values: [id],
    // });
    console.info({
      Name: 'Order deleted.',
      Body: { id, deletedRows: dbResponse.rowCount },
    });
  } catch (err: any) {
    throw handleError(err);
  }
}

export async function updateOrder(params: {
  id: string;
  status?: string;
  shipping?: {
    trackingCompany?: string;
    trackingNumber?: string;
  };
}): Promise<void> {
  try {
    const { id, status, shipping } = params;
    console.info({
      Name: 'Updating order.',
      Body: { id },
    });

    if (status) {
      const text = `UPDATE orders set status = '${status}' WHERE id = $1;`;
      console.log('textxtxtx', text)
      const dbResponse = await pool.query({ text, values: [id] });
      console.info({
        Name: 'Order status updated.',
        Body: { id, updatedRows: dbResponse.rowCount },
      });
    }

    if (shipping) {
      const text = `INSERT INTO shipments (order_id, tracking_company, tracking_number) 
      VALUES ($1, $2, $3)
      ON CONFLICT (order_id) DO UPDATE 
        SET tracking_company = $2, 
        tracking_number = $3;`
      const dbResponse = await pool.query({ text, values: [id, shipping.trackingCompany, shipping.trackingNumber] });
      console.info({
        Name: 'Order shipment updated.',
        Body: { id, updatedRows: dbResponse.rowCount },
      });
    }
  } catch (err: any) {
    let error = err;
    throw handleError(error);
  }
}
