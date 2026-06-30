import type {
  ApiErrorResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
} from "../../../types/sandbox-api.js";

export class AuthClient {
  constructor(private readonly baseUrl: string) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.loginRequest(credentials);

    if (!response.ok) {
      throw new Error(`POST /api/auth/login failed: ${response.status}`);
    }

    return response.json() as Promise<LoginResponse>;
  }

  async loginAttempt(
    credentials: LoginRequest,
  ): Promise<{ status: number; body: LoginResponse | ApiErrorResponse }> {
    const response = await this.loginRequest(credentials);
    const body = (await response.json()) as LoginResponse | ApiErrorResponse;
    return { status: response.status, body };
  }

  async getMe(token: string): Promise<MeResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`GET /api/auth/me failed: ${response.status}`);
    }

    return response.json() as Promise<MeResponse>;
  }

  private loginRequest(credentials: LoginRequest): Promise<Response> {
    return fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  }
}
