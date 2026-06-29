import path from "node:path";
import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import { UsersClient } from "./users-client.js";

const { eachLike, string, integer, boolean } = MatchersV3;

const provider = new PactV3({
    dir: path.resolve(process.cwd(), "pacts"),
    consumer: "testflow-web",
    provider: "sandbox-api",
});

describe("testflow-web → sandbox-api", () => {
    it("GET /api/users?role=admin returns filtered users", async () => {
        provider
            .given("admin users exist")
            .uponReceiving("a request for admin users")
            .withRequest({
                method: "GET",
                path: "/api/users",
                query: { role: "admin" },
            })
            .willRespondWith({
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: {
                    users: eachLike({
                        id: string("1"),
                        name: string("Alice QA"),
                        email: string("alice@example.com"),
                        role: string("admin"),
                        active: boolean(true),
                    }),
                    total: integer(1),
                },
            });

        await provider.executeTest(async (mockServer) => {
            const client = new UsersClient(mockServer.url);
            const result = await client.getUsers({ role: "admin" });

            expect(result.users.length).toBeGreaterThan(0);
            expect(result.users.every((user) => user.role === "admin")).toBe(true);
        });
    });
});
