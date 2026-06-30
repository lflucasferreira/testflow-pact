import type { ProductsResponse } from "../../../types/sandbox-api.js";

export class ProductsClient {
  constructor(private readonly baseUrl: string) {}

  async getProducts(): Promise<ProductsResponse> {
    const response = await fetch(`${this.baseUrl}/api/products`);

    if (!response.ok) {
      throw new Error(`GET /api/products failed: ${response.status}`);
    }

    return response.json() as Promise<ProductsResponse>;
  }
}
