import { Verifier } from "@pact-foundation/pact";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

const verifier = new Verifier({
  provider: "sandbox-api",
  providerBaseUrl: requiredEnv("PROVIDER_BASE_URL"),
  pactBrokerUrl: requiredEnv("PACT_BROKER_BASE_URL"),
  pactBrokerUsername: requiredEnv("PACT_BROKER_USERNAME"),
  pactBrokerPassword: requiredEnv("PACT_BROKER_PASSWORD"),
  publishVerificationResult: true,
  providerVersion: process.env.PACT_PROVIDER_VERSION ?? "0.1.0",
  consumerVersionSelectors: [
    { tag: process.env.PACT_CONSUMER_TAG ?? "main", latest: true },
  ],
  stateHandlers: {
    "the API is healthy": async () => undefined,
    "users exist": async () => undefined,
    "products exist": async () => undefined,
    "valid demo credentials exist": async () => undefined,
  },
});

try {
  const output = await verifier.verifyProvider();
  console.log(output);
  console.log("Provider verification passed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
