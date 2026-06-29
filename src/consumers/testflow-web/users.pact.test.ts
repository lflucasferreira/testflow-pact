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
    it("GET /api/users returns users", async () => {
        provider
          .given("users exist")
          .uponReceiving("a request for users")
          .withRequest({
            method: "GET",
            path: "/api/users",
          })
          .willRespondWith({
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: {
                users: eachLike({
                    id: string("1"),
                    name: string("Alice QA"),
                    email: string("alice@example.com"),
                    role: string("admin"),
                    active: boolean(true),
                }),
                total: integer(3),
            },
          });

        await provider.executeTest(async (mockServer) => {
            const client = new UsersClient(mockServer.url);
            const result = await client.getUsers();

            expect(result.users.length).toBeGreaterThan(0);
            expect(result.total).toBeGreaterThan(0);
            expect(result.users[0]).toMatchObject({
                id: expect.any(String),
                name: expect.any(String),
                email: expect.any(String),
                role: expect.any(String),
                active: expect.any(Boolean),
            });
        });
    });
});
