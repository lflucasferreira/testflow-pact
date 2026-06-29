import path from "node:path";
import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import { MetaClient } from "./meta-client.js";

const { string } = MatchersV3;

const provider = new PactV3({
    dir: path.resolve(process.cwd(), "pacts"),
    consumer: "testflow-web",
    provider: "sandbox-api",
});

describe("testflow-web → sandbox-api", () => {
    it("GET /api/meta returns API metadata", async () => {
        provider
            .given("API metadata exists")
            .uponReceiving("a request for API metadata")
            .withRequest({
                method: "GET",
                path: "/api/meta",
            })
            .willRespondWith({
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: {
                    name: string("TestFlow Sandbox API"),
                    version: string("1.0.0"),
                    documentation: string("/api/docs.html"),
                    openapi: string("/api/openapi.yaml"),
                },
            });

        await provider.executeTest(async (mockServer) => {
            const client = new MetaClient(mockServer.url);
            const result = await client.getMeta();

            expect(result.name).toContain("Sandbox");
            expect(result.openapi).toContain("openapi");
        });
    });
});
