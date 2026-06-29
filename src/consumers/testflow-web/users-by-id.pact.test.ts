import path from "node:path";
import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import { UsersClient } from "./users-client.js";

const { string, boolean } = MatchersV3;

const provider = new PactV3({
    dir: path.resolve(process.cwd(), "pacts"),
    consumer: "testflow-web",
    provider: "sandbox-api",
});

describe("testflow-web → sandbox-api", () => {
    it("GET /api/users/:id returns a user", async () => {
        provider
            .given("user 1 exists")
            .uponReceiving("a request for user by id")
            .withRequest({
                method: "GET",
                path: "/api/users/1",
            })
            .willRespondWith({
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: {
                    user: {
                        id: string("1"),
                        name: string("Alice QA"),
                        email: string("alice@example.com"),
                        role: string("admin"),
                        active: boolean(true),
                    },
                },
            });

        await provider.executeTest(async (mockServer) => {
            const client = new UsersClient(mockServer.url);
            const result = await client.getUserById("1");

            expect(result.user.id).toBe("1");
            expect(result.user.email).toBe("alice@example.com");
        });
    });
});
