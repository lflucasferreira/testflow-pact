import { describe, expect, it } from "vitest";
import { CONSUMER_TESTFLOW_WEB } from "../../../pact/constants.js";
import { createPact } from "../../../pact/create-pact.js";
import { JSON_CONTENT_TYPE, apiErrorMatcher } from "../../../pact/matchers.js";
import { AuthClient } from "./auth-client.js";

const provider = createPact(CONSUMER_TESTFLOW_WEB);

describe("testflow-web → sandbox-api / auth", () => {
  it("POST /api/auth/login returns 401 for invalid credentials", async () => {
    const invalidCredentials = { email: "wrong@example.com", password: "wrong" };

    provider
      .given("invalid credentials are provided")
      .uponReceiving("a login request with invalid credentials")
      .withRequest({
        method: "POST",
        path: "/api/auth/login",
        headers: JSON_CONTENT_TYPE,
        body: invalidCredentials,
      })
      .willRespondWith({
        status: 401,
        headers: JSON_CONTENT_TYPE,
        body: apiErrorMatcher("Invalid email or password", 401),
      });

    await provider.executeTest(async (mockServer) => {
      const client = new AuthClient(mockServer.url);
      const result = await client.loginAttempt(invalidCredentials);

      expect(result.status).toBe(401);
      expect(result.body).toMatchObject({
        error: { statusCode: 401, message: expect.any(String) },
      });
    });
  });
});
