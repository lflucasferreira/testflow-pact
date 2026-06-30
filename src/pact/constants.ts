import path from "node:path";

export const PROVIDER_NAME = "sandbox-api";
export const CONSUMER_TESTFLOW_WEB = "testflow-web";
export const CONSUMER_MOBILE_APP = "mobile-app";

export const CONSUMERS = [CONSUMER_TESTFLOW_WEB, CONSUMER_MOBILE_APP] as const;
export type ConsumerName = (typeof CONSUMERS)[number];

export const PACTS_DIR = path.resolve(process.cwd(), "pacts");
