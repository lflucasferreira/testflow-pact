import path from "node:path";
import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import { OrdersClient } from "./orders-client.js";

const { string, integer, number } = MatchersV3;

const provider = new PactV3({
    dir: path.resolve(process.cwd(), "pacts"),
    consumer: "testflow-web",
    provider: "sandbox-api",
});

describe("testflow-web → sandbox-api", () => {
    it("POST /api/orders creates an order", async () => {
        provider
            .given("product p1 exists")
            .uponReceiving("a request to create an order")
            .withRequest({
                method: "POST",
                path: "/api/orders",
                headers: { "Content-Type": "application/json" },
                body: { productId: "p1", quantity: 1 },
            })
            .willRespondWith({
                status: 201,
                headers: { "Content-Type": "application/json" },
                body: {
                    order: {
                        id: string("ord-1"),
                        productId: string("p1"),
                        quantity: integer(1),
                        total: number(0),
                        status: string("confirmed"),
                    },
                },
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
