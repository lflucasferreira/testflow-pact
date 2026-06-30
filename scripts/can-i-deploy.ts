import { execSync } from "node:child_process";
import path from "node:path";
import { envOrDefault, requiredEnv } from "../src/lib/env.js";
import { CONSUMERS, PROVIDER_NAME, type ConsumerName } from "../src/pact/constants.js";

function runCanIDeploy(consumer: ConsumerName): void {
  const consumerVersion = envOrDefault("PACT_CONSUMER_VERSION", "0.1.0");
  const providerVersion = envOrDefault("PACT_PROVIDER_VERSION", "0.1.0");
  const brokerBaseUrl = requiredEnv("PACT_BROKER_BASE_URL");
  const username = requiredEnv("PACT_BROKER_USERNAME");
  const password = requiredEnv("PACT_BROKER_PASSWORD");
  const pactBrokerCli = path.resolve("node_modules/.bin/pact-broker");

  const args = [
    "can-i-deploy",
    "--pacticipant",
    consumer,
    "--version",
    consumerVersion,
    "--pacticipant",
    PROVIDER_NAME,
    "--version",
    providerVersion,
    "--broker-base-url",
    brokerBaseUrl,
    "--broker-username",
    username,
    "--broker-password",
    password,
  ];

  console.log(`Checking: ${consumer}@${consumerVersion} + ${PROVIDER_NAME}@${providerVersion}`);

  execSync(`"${pactBrokerCli}" ${args.map((arg) => `"${arg}"`).join(" ")}`, {
    stdio: "inherit",
    env: process.env,
  });
}

const requestedConsumer = process.env.PACT_CONSUMER_NAME as ConsumerName | undefined;
const consumers = requestedConsumer ? [requestedConsumer] : CONSUMERS;

try {
  for (const consumer of consumers) {
    runCanIDeploy(consumer);
  }
  console.log(`can-i-deploy passed for: ${consumers.join(", ")}`);
} catch {
  process.exit(1);
}
