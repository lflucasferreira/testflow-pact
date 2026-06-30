import { describe, expect, it } from "vitest";
import { ALICE_USER } from "../../../fixtures/credentials.js";
import { CONSUMER_TESTFLOW_WEB } from "../../../pact/constants.js";
import { createPact } from "../../../pact/create-pact.js";
import { JSON_CONTENT_TYPE, userMatcher } from "../../../pact/matchers.js";
import { UsersClient } from "./users-client.js";

const provider = createPact(CONSUMER_TESTFLOW_WEB);

describe("testflow-web → sandbox-api / users", () => {
  it("GET /api/users/:id returns a user", async () => {
    provider
      .given("user 1 exists")
      .uponReceiving("a request for user by id")
      .withRequest({
        method: "GET",
        path: "/api/users/1",
      })
      .willRespondWith({
        status: 200,
        headers: JSON_CONTENT_TYPE,
        body: { user: userMatcher() },
      });

    await provider.executeTest(async (mockServer) => {
      const client = new UsersClient(mockServer.url);
      const result = await client.getUserById("1");

      expect(result.user.id).toBe(ALICE_USER.id);
      expect(result.user.email).toBe(ALICE_USER.email);
    });
  });
});
