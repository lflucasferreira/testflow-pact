import { Verifier } from "@pact-foundation/pact";
import { buildVerifierOptions } from "./verifier-config.js";

const verifier = new Verifier(buildVerifierOptions());

try {
  const output = await verifier.verifyProvider();
  console.log(output);
  console.log("Provider verification passed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
