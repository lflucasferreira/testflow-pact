import type { VerifierOptions } from "@pact-foundation/pact";
import { envOrDefault, requiredEnv } from "../lib/env.js";
import { PROVIDER_NAME } from "../pact/constants.js";
import { stateHandlers } from "./state-handlers/index.js";

export function buildVerifierOptions(): VerifierOptions {
  return {
    provider: PROVIDER_NAME,
    providerBaseUrl: requiredEnv("PROVIDER_BASE_URL"),
    pactBrokerUrl: requiredEnv("PACT_BROKER_BASE_URL"),
    pactBrokerUsername: requiredEnv("PACT_BROKER_USERNAME"),
    pactBrokerPassword: requiredEnv("PACT_BROKER_PASSWORD"),
    publishVerificationResult: true,
    providerVersion: envOrDefault("PACT_PROVIDER_VERSION", "0.1.0"),
    consumerVersionSelectors: [
      { tag: envOrDefault("PACT_CONSUMER_TAG", "main"), latest: true },
    ],
    stateHandlers,
  };
}
