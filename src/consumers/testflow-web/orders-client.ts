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

export class OrdersClient {
  constructor(private readonly baseUrl: string) {}

  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await fetch(`${this.baseUrl}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: request.productId,
        quantity: request.quantity ?? 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`POST /api/orders failed: ${response.status}`);
    }

    return response.json() as Promise<CreateOrderResponse>;
  }
}
