import { describe, expect, it } from "vitest";
import { CONSUMER_TESTFLOW_WEB } from "../../../pact/constants.js";
import { createPact } from "../../../pact/create-pact.js";
import { JSON_CONTENT_TYPE, apiMetaMatcher } from "../../../pact/matchers.js";
import { MetaClient } from "./meta-client.js";

const provider = createPact(CONSUMER_TESTFLOW_WEB);

describe("testflow-web → sandbox-api / meta", () => {
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
        headers: JSON_CONTENT_TYPE,
        body: apiMetaMatcher(),
      });

    await provider.executeTest(async (mockServer) => {
      const client = new MetaClient(mockServer.url);
      const result = await client.getMeta();

      expect(result.name).toContain("Sandbox");
      expect(result.openapi).toContain("openapi");
    });
  });
});
