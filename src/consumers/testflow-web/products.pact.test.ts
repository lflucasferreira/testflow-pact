import path from "node:path";
import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import { ProductsClient } from "./products-client.js";

const { eachLike, string, decimal } = MatchersV3;

const provider = new PactV3({
  dir: path.resolve(process.cwd(), "pacts"),
  consumer: "testflow-web",
  provider: "sandbox-api",
});

describe("testflow-web → sandbox-api", () => {
  it("GET /api/products returns products", async () => {
    provider
      .given("products exist")
      .uponReceiving("a request for products")
      .withRequest({
        method: "GET",
        path: "/api/products",
      })
      .willRespondWith({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
          products: eachLike({
            id: string("p1"),
            name: string("Cypress License"),
            price: decimal(9.99),
            category: string("tool"),
          }),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const client = new ProductsClient(mockServer.url);
      const result = await client.getProducts();

      expect(result.products.length).toBeGreaterThan(0);
      expect(result.products[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number),
        category: expect.any(String),
      });
    });
  });
});
