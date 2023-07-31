export interface Product {
  id: string;
  name: string;
  description: string;
  inventory: number;
  price: number;
  status?: 'active' | 'retired';
  categoryId?: string;
  category?: string;
  imageUrl?: string;
  thumbnail?: string;
  created: Date | string;
  updated: Date | string;
}

export interface ProductDBRecord {
  id: string;
  name: string;
  description: string;
  inventory: number;
  price: number;
  status: 'active' | 'retired';
  category_id?: string;
  category?: string;
  image_url?: string;
  thumbnail?: string;
  created: Date;
  updated: Date;
}

export interface GetProduct {
  headers: {
    authorization?: string;
  };
  params: {
    id: string;
  };
}

export interface ListProductsRes {
  items: Array<Product>;
}

export interface DeleteProduct {
  headers: {
    authorization?: string;
  };
  params: {
    id: string;
  };
}

export interface ListProducts {
  headers: {
    authorization?: string;
  };
}

export interface CreateProduct {
  headers: {
    authorization?: string;
  };
  body: {
    name: string;
    description?: string;
    inventory: number;
    price: number;
    categoryId?: string;
    imageUrl: string;
  };
}

export interface UpdateProduct {
  headers: {
    authorization?: string;
  };
  params: {
    id: string;
  };
  body: {
    name?: string;
    description?: string;
    inventory?: number;
    price?: number;
    categoryId?: string;
    imageUrl?: string;
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface ListCategoriesRes {
  items: Array<Category>;
}
