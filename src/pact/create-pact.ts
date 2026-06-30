import { PactV3 } from "@pact-foundation/pact";
import { type ConsumerName, PACTS_DIR, PROVIDER_NAME } from "./constants.js";

export function createPact(consumer: ConsumerName): PactV3 {
  return new PactV3({
    dir: PACTS_DIR,
    consumer,
    provider: PROVIDER_NAME,
  });
}
