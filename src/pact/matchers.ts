import { MatchersV3 } from "@pact-foundation/pact";
import { ALICE_USER, DEMO_USER } from "../fixtures/credentials.js";

const { eachLike, string, integer, boolean, number } = MatchersV3;

export const JSON_CONTENT_TYPE = { "Content-Type": "application/json" };

export function userMatcher(overrides: Partial<typeof ALICE_USER> = {}) {
  const user = { ...ALICE_USER, ...overrides };
  return {
    id: string(user.id),
    name: string(user.name),
    email: string(user.email),
    role: string(user.role),
    active: boolean(user.active),
  };
}

export function usersListMatcher(total: number) {
  return {
    users: eachLike(userMatcher()),
    total: integer(total),
  };
}

export function loginUserMatcher() {
  return {
    id: string(DEMO_USER.id),
    email: string(DEMO_USER.email),
    name: string(DEMO_USER.name),
  };
}

export function loginResponseMatcher() {
  return {
    user: loginUserMatcher(),
    token: string("sandbox-jwt-token-demo"),
  };
}

export function meUserMatcher() {
  return {
    id: string(DEMO_USER.id),
    email: string(DEMO_USER.email),
    name: string(DEMO_USER.name),
    role: string("user"),
    active: boolean(true),
  };
}

export function apiErrorMatcher(message: string, statusCode: number) {
  return {
    error: {
      message: string(message),
      statusCode: integer(statusCode),
    },
  };
}

export function productMatcher(
  overrides: Partial<{ id: string; name: string; price: number; category: string }> = {},
) {
  const product = {
    id: "p1",
    name: "Cypress License",
    price: 0,
    category: "tool",
    ...overrides,
  };
  return {
    id: string(product.id),
    name: string(product.name),
    price: number(product.price),
    category: string(product.category),
  };
}

export function productsListMatcher() {
  return {
    products: eachLike(productMatcher()),
  };
}

export function orderMatcher(
  overrides: Partial<{
    id: string;
    productId: string;
    quantity: number;
    total: number;
    status: string;
  }> = {},
) {
  const order = {
    id: "ord-1",
    productId: "p1",
    quantity: 1,
    total: 0,
    status: "confirmed",
    ...overrides,
  };
  return {
    id: string(order.id),
    productId: string(order.productId),
    quantity: integer(order.quantity),
    total: number(order.total),
    status: string(order.status),
  };
}

export function apiMetaMatcher() {
  return {
    name: string("TestFlow Sandbox API"),
    version: string("1.0.0"),
    documentation: string("/api/docs.html"),
    openapi: string("/api/openapi.yaml"),
  };
}
