import path from "node:path";
import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import { AuthClient } from "./auth-client.js";

const { string, integer } = MatchersV3;

const provider = new PactV3({
    dir: path.resolve(process.cwd(), "pacts"),
    consumer: "testflow-web",
    provider: "sandbox-api",
});

describe("testflow-web → sandbox-api", () => {
    it("POST /api/auth/login returns 401 for invalid credentials", async () => {
        provider
            .given("invalid credentials are provided")
            .uponReceiving("a login request with invalid credentials")
            .withRequest({
                method: "POST",
                path: "/api/auth/login",
                headers: { "Content-Type": "application/json" },
                body: { email: "wrong@example.com", password: "wrong" },
            })
            .willRespondWith({
                status: 401,
                headers: { "Content-Type": "application/json" },
                body: {
                    error: {
                        message: string("Invalid email or password"),
                        statusCode: integer(401),
                    },
                },
            });

        await provider.executeTest(async (mockServer) => {
            const client = new AuthClient(mockServer.url);
            const result = await client.loginAttempt({
                email: "wrong@example.com",
                password: "wrong",
            });

            expect(result.status).toBe(401);
            expect(result.body).toMatchObject({
                error: { statusCode: 401, message: expect.any(String) },
            });
        });
    });
});
