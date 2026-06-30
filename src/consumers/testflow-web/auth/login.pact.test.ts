import { describe, expect, it } from "vitest";
import { DEMO_CREDENTIALS } from "../../../fixtures/credentials.js";
import { CONSUMER_TESTFLOW_WEB } from "../../../pact/constants.js";
import { createPact } from "../../../pact/create-pact.js";
import { JSON_CONTENT_TYPE, loginResponseMatcher } from "../../../pact/matchers.js";
import { AuthClient } from "./auth-client.js";

const provider = createPact(CONSUMER_TESTFLOW_WEB);

describe("testflow-web → sandbox-api / auth", () => {
  it("POST /api/auth/login returns token", async () => {
    provider
      .given("valid demo credentials exist")
      .uponReceiving("a login request with valid credentials")
      .withRequest({
        method: "POST",
        path: "/api/auth/login",
        headers: JSON_CONTENT_TYPE,
        body: {
          email: DEMO_CREDENTIALS.email,
          password: DEMO_CREDENTIALS.password,
        },
      })
      .willRespondWith({
        status: 200,
        headers: JSON_CONTENT_TYPE,
        body: loginResponseMatcher(),
      });

    await provider.executeTest(async (mockServer) => {
      const client = new AuthClient(mockServer.url);
      const result = await client.login(DEMO_CREDENTIALS);

      expect(result.user.email).toBe(DEMO_CREDENTIALS.email);
      expect(result.token).toEqual(expect.any(String));
    });
  });
});
