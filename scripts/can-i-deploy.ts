import { execSync } from "node:child_process";
import path from "node:path";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

const consumer = process.env.PACT_CONSUMER_NAME ?? "testflow-web";
const provider = process.env.PACT_PROVIDER_NAME ?? "sandbox-api";
const consumerVersion = process.env.PACT_CONSUMER_VERSION ?? "0.1.0";
const providerVersion = process.env.PACT_PROVIDER_VERSION ?? "0.1.0";

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
  provider,
  "--version",
  providerVersion,
  "--broker-base-url",
  brokerBaseUrl,
  "--broker-username",
  username,
  "--broker-password",
  password,
];

console.log(`Checking: ${consumer}@${consumerVersion} + ${provider}@${providerVersion}`);

try {
  execSync(`"${pactBrokerCli}" ${args.map((arg) => `"${arg}"`).join(" ")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch {
  process.exit(1);
}
