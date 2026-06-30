import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { envOrDefault, requiredEnv } from "../src/lib/env.js";
import { PACTS_DIR } from "../src/pact/constants.js";

async function publishPacts(): Promise<void> {
  const brokerBaseUrl = requiredEnv("PACT_BROKER_BASE_URL").replace(/\/$/, "");
  const username = requiredEnv("PACT_BROKER_USERNAME");
  const password = requiredEnv("PACT_BROKER_PASSWORD");
  const consumerVersion = envOrDefault("PACT_CONSUMER_VERSION", "0.1.0");
  const tag = envOrDefault("PACT_CONSUMER_TAG", "main");

  const auth = Buffer.from(`${username}:${password}`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${auth}`,
  };

  const files = (await readdir(PACTS_DIR)).filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    throw new Error(`No pact files found in ${PACTS_DIR}. Run npm run test:consumer first.`);
  }

  for (const file of files) {
    const filePath = path.join(PACTS_DIR, file);
    const content = await readFile(filePath, "utf-8");
    const pact = JSON.parse(content) as {
      consumer: { name: string };
      provider: { name: string };
    };

    const consumer = pact.consumer.name;
    const provider = pact.provider.name;

    const publishUrl =
      `${brokerBaseUrl}/pacts/provider/${encodeURIComponent(provider)}` +
      `/consumer/${encodeURIComponent(consumer)}` +
      `/version/${encodeURIComponent(consumerVersion)}` +
      `?tag=${encodeURIComponent(tag)}`;

    const publishResponse = await fetch(publishUrl, {
      method: "PUT",
      headers,
      body: content,
    });

    if (!publishResponse.ok) {
      const body = await publishResponse.text();
      throw new Error(`Failed to publish ${file}: ${publishResponse.status} ${body}`);
    }

    const tagUrl =
      `${brokerBaseUrl}/pacticipants/${encodeURIComponent(consumer)}` +
      `/versions/${encodeURIComponent(consumerVersion)}` +
      `/tags/${encodeURIComponent(tag)}`;

    const tagResponse = await fetch(tagUrl, {
      method: "PUT",
      headers,
      body: "{}",
    });

    if (!tagResponse.ok) {
      const body = await tagResponse.text();
      throw new Error(`Failed to tag ${consumer}@${consumerVersion}: ${tagResponse.status} ${body}`);
    }

    console.log(`Published ${file} → ${consumer}@${consumerVersion} (tag: ${tag})`);
  }
}

publishPacts().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
