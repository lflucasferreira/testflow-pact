export const DEMO_CREDENTIALS = {
  email: "demo@automation.io",
  password: "Demo123!",
} as const;

export const DEMO_TOKEN = "sandbox-jwt-token-demo";

export const DEMO_USER = {
  id: "demo-1",
  email: DEMO_CREDENTIALS.email,
  name: "Demo User",
} as const;

export const ALICE_USER = {
  id: "1",
  name: "Alice QA",
  email: "alice@example.com",
  role: "admin",
  active: true,
} as const;
