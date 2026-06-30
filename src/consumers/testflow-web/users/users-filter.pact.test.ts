import { describe, expect, it } from "vitest";
import { CONSUMER_TESTFLOW_WEB } from "../../../pact/constants.js";
import { createPact } from "../../../pact/create-pact.js";
import { JSON_CONTENT_TYPE, usersListMatcher } from "../../../pact/matchers.js";
import { UsersClient } from "./users-client.js";

const provider = createPact(CONSUMER_TESTFLOW_WEB);

describe("testflow-web → sandbox-api / users", () => {
  it("GET /api/users?role=admin returns filtered users", async () => {
    provider
      .given("admin users exist")
      .uponReceiving("a request for admin users")
      .withRequest({
        method: "GET",
        path: "/api/users",
        query: { role: "admin" },
      })
      .willRespondWith({
        status: 200,
        headers: JSON_CONTENT_TYPE,
        body: usersListMatcher(1),
      });

    await provider.executeTest(async (mockServer) => {
      const client = new UsersClient(mockServer.url);
      const result = await client.getUsers({ role: "admin" });

      expect(result.users.length).toBeGreaterThan(0);
      expect(result.users.every((user) => user.role === "admin")).toBe(true);
    });
  });
});
