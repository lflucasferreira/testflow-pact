import { describe, expect, it } from "vitest";
import { DEMO_CREDENTIALS, DEMO_TOKEN } from "../../../fixtures/credentials.js";
import { CONSUMER_TESTFLOW_WEB } from "../../../pact/constants.js";
import { createPact } from "../../../pact/create-pact.js";
import { JSON_CONTENT_TYPE, meUserMatcher } from "../../../pact/matchers.js";
import { AuthClient } from "./auth-client.js";

const provider = createPact(CONSUMER_TESTFLOW_WEB);

describe("testflow-web → sandbox-api / auth", () => {
  it("GET /api/auth/me returns current user", async () => {
    provider
      .given("the user is authenticated")
      .uponReceiving("a request for the current user")
      .withRequest({
        method: "GET",
        path: "/api/auth/me",
        headers: { Authorization: `Bearer ${DEMO_TOKEN}` },
      })
      .willRespondWith({
        status: 200,
        headers: JSON_CONTENT_TYPE,
        body: { user: meUserMatcher() },
      });

    await provider.executeTest(async (mockServer) => {
      const client = new AuthClient(mockServer.url);
      const result = await client.getMe(DEMO_TOKEN);

      expect(result.user.email).toBe(DEMO_CREDENTIALS.email);
      expect(result.user.id).toBe("demo-1");
    });
  });
});
