import { describe, expect, it } from "vitest";
import { CONSUMER_TESTFLOW_WEB } from "../../../pact/constants.js";
import { createPact } from "../../../pact/create-pact.js";
import { JSON_CONTENT_TYPE, orderMatcher } from "../../../pact/matchers.js";
import { OrdersClient } from "./orders-client.js";

const provider = createPact(CONSUMER_TESTFLOW_WEB);

describe("testflow-web → sandbox-api / catalog", () => {
  it("POST /api/orders creates an order", async () => {
    provider
      .given("product p1 exists")
      .uponReceiving("a request to create an order")
      .withRequest({
        method: "POST",
        path: "/api/orders",
        headers: JSON_CONTENT_TYPE,
        body: { productId: "p1", quantity: 1 },
      })
      .willRespondWith({
        status: 201,
        headers: JSON_CONTENT_TYPE,
        body: { order: orderMatcher() },
      });

    await provider.executeTest(async (mockServer) => {
      const client = new OrdersClient(mockServer.url);
      const result = await client.createOrder({ productId: "p1", quantity: 1 });

      expect(result.order.productId).toBe("p1");
      expect(result.order.quantity).toBe(1);
      expect(result.order.status).toBe("confirmed");
    });
  });
});
