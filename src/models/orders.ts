export interface Order {
  id: string;
  status: 'processing' | 'cancelled' | 'delivered';
  products: OrderProduct[];
  shipping?: {
    trackingCompany?: string;
    trackingNumber?: string;
  },
  trackingCompany?: string;
  trackingNumber?: string;
  created: Date | string;
  updated: Date | string;
}

export interface DbOrder {
  id: string;
  status: 'processing' | 'cancelled' | 'delivered';
  products: OrderProduct[];
  tracking_company?: string;
  tracking_number?: string;
  created: Date | string;
  updated: Date | string;
}

export interface OrderProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  created: Date | string;
  updated: Date | string;
}

export interface GetOrder {
  headers: {
    authorization?: string;
  };
  params: {
    id: string;
  };
}

export interface ListOrdersRes {
  items: Array<Order>;
}

export interface DeleteOrder {
  headers: {
    authorization?: string;
  };
  params: {
    id: string;
  };
}

export interface ListOrders {
  headers: {
    authorization?: string;
  };
}

export interface CreateOrder {
  headers: {
    authorization?: string;
  };
  body: {
    products: {
      id: string;
      quantity: number;
    };
    shipping?:{
      trackingCompany?: string;
      trackingNumber?: string;
    },
    status?: 'processing' | 'cancelled' | 'delivered';
  };
}

export interface UpdateOrder {
  headers: {
    authorization?: string;
  };
  params: {
    id: string;
  };
  body: {
    status?: 'processing' | 'cancelled' | 'delivered';
    shipping?:{
      trackingCompany?: string;
      trackingNumber?: string;
    },
  };
}
