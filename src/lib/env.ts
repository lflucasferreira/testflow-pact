export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export function envOrDefault(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}
