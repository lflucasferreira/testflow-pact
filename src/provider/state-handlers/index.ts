import { authStateHandlers } from "./auth.js";
import { catalogStateHandlers } from "./catalog.js";
import { healthStateHandlers } from "./health.js";
import { metaStateHandlers } from "./meta.js";
import { usersStateHandlers } from "./users.js";

export const stateHandlers = {
  ...healthStateHandlers,
  ...authStateHandlers,
  ...usersStateHandlers,
  ...catalogStateHandlers,
  ...metaStateHandlers,
};
