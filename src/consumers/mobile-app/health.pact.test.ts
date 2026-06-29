import path from "node:path";
import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { describe, expect, it } from "vitest";
import { HealthClient } from "./health-client.js";

const { regex } = MatchersV3;

const provider = new PactV3({
  dir: path.resolve(process.cwd(), "pacts"),
  consumer: "mobile-app",
  provider: "sandbox-api",
});

describe("mobile-app → sandbox-api", () => {
  it("GET /health returns status ok", async () => {
    provider
      .given("the API is healthy")
      .uponReceiving("a health check request")
      .withRequest({
        method: "GET",
        path: "/health",
      })
      .willRespondWith({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
          status: "ok",
          timestamp: regex(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
            "2026-06-28T12:00:00.000Z",
          ),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const client = new HealthClient(mockServer.url);
      const health = await client.getHealth();

      expect(health.status).toBe("ok");
      expect(health.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);
    });
  });
});
