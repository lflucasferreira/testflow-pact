const noop = async () => undefined;

export const authStateHandlers = {
  "valid demo credentials exist": noop,
  "the user is authenticated": noop,
  "invalid credentials are provided": noop,
};
