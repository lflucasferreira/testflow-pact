import type { UsersFilter, UsersResponse } from "../../../types/sandbox-api.js";

export class UsersClient {
  constructor(private readonly baseUrl: string) {}

  async getUsers(filter?: UsersFilter): Promise<UsersResponse> {
    const params = new URLSearchParams();
    if (filter?.role) {
      params.set("role", filter.role);
    }
    if (filter?.active !== undefined) {
      params.set("active", String(filter.active));
    }

    const query = params.toString();
    const url = `${this.baseUrl}/api/users${query ? `?${query}` : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`GET /api/users failed: ${response.status}`);
    }

    return response.json() as Promise<UsersResponse>;
  }

  async getUserById(id: string): Promise<{ user: UsersResponse["users"][number] }> {
    const response = await fetch(`${this.baseUrl}/api/users/${id}`);

    if (!response.ok) {
      throw new Error(`GET /api/users/${id} failed: ${response.status}`);
    }

    return response.json() as Promise<{ user: UsersResponse["users"][number] }>;
  }
}
