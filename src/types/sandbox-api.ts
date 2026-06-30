export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

export type UsersResponse = {
  users: User[];
  total: number;
};

export type UsersFilter = {
  role?: string;
  active?: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
};

export type MeResponse = {
  user: User;
};

export type ApiErrorResponse = {
  error: {
    message: string;
    statusCode: number;
  };
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export type ProductsResponse = {
  products: Product[];
};

export type CreateOrderRequest = {
  productId: string;
  quantity?: number;
};

export type Order = {
  id: string;
  productId: string;
  quantity: number;
  total: number;
  status: string;
};

export type CreateOrderResponse = {
  order: Order;
};

export type ApiMeta = {
  name: string;
  version: string;
  documentation: string;
  openapi: string;
};

export type HealthResponse = {
  status: string;
  timestamp: string;
};
