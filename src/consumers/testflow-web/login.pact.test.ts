import path from "node:path";
import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import { AuthClient } from "./auth-client.js";

const { string } = MatchersV3;

const provider = new PactV3({
    dir: path.resolve(process.cwd(), "pacts"),
    consumer: "testflow-web",
    provider: "sandbox-api",
});

describe("testflow-web → sandbox-api", () => {
    it("POST /api/auth/login returns token", async () => {
        provider
            .given("valid demo credentials exist")
            .uponReceiving("a login request with valid credentials")
            .withRequest({
                method: "POST",
                path: "/api/auth/login",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    email: "demo@automation.io",
                    password: "Demo123!",
                },
            })
            .willRespondWith({
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    user: {
                        id: string("demo-1"),
                        email: string("demo@automation.io"),
                        name: string("Demo User"),
                    },
                    token: string("sandbox-jwt-token-demo"),
                },
            });

        await provider.executeTest(async (mockServer) => {
            const client = new AuthClient(mockServer.url);
            const result = await client.login({
                email: "demo@automation.io",
                password: "Demo123!",
            });

            expect(result.user.email).toBe("demo@automation.io");
            expect(result.token).toEqual(expect.any(String));
        });
    });
}); 