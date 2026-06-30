import { describe, expect, it } from "vitest";
import { CONSUMER_TESTFLOW_WEB } from "../../../pact/constants.js";
import { createPact } from "../../../pact/create-pact.js";
import { JSON_CONTENT_TYPE, usersListMatcher } from "../../../pact/matchers.js";
import { UsersClient } from "./users-client.js";

const provider = createPact(CONSUMER_TESTFLOW_WEB);

describe("testflow-web → sandbox-api / users", () => {
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
        headers: JSON_CONTENT_TYPE,
        body: usersListMatcher(3),
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
