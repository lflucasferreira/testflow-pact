import { describe, expect, it } from "vitest";
import { CONSUMER_TESTFLOW_WEB } from "../../../pact/constants.js";
import { createPact } from "../../../pact/create-pact.js";
import { JSON_CONTENT_TYPE, productsListMatcher } from "../../../pact/matchers.js";
import { ProductsClient } from "./products-client.js";

const provider = createPact(CONSUMER_TESTFLOW_WEB);

describe("testflow-web → sandbox-api / catalog", () => {
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
        headers: JSON_CONTENT_TYPE,
        body: productsListMatcher(),
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
