import path from "node:path";
import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import { AuthClient } from "./auth-client.js";

const { string, boolean } = MatchersV3;

const provider = new PactV3({
    dir: path.resolve(process.cwd(), "pacts"),
    consumer: "testflow-web",
    provider: "sandbox-api",
});

describe("testflow-web → sandbox-api", () => {
    it("GET /api/auth/me returns current user", async () => {
        provider
            .given("the user is authenticated")
            .uponReceiving("a request for the current user")
            .withRequest({
                method: "GET",
                path: "/api/auth/me",
                headers: { Authorization: "Bearer sandbox-jwt-token-demo" },
            })
            .willRespondWith({
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: {
                    user: {
                        id: string("demo-1"),
                        email: string("demo@automation.io"),
                        name: string("Demo User"),
                        role: string("user"),
                        active: boolean(true),
                    },
                },
            });

        await provider.executeTest(async (mockServer) => {
            const client = new AuthClient(mockServer.url);
            const result = await client.getMe("sandbox-jwt-token-demo");

            expect(result.user.email).toBe("demo@automation.io");
            expect(result.user.id).toBe("demo-1");
        });
    });
});
