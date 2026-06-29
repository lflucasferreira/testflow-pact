export type HealthResponse = {
  status: string;
  timestamp: string;
};

export class HealthClient {
  constructor(private readonly baseUrl: string) {}

  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/health`);

    if (!response.ok) {
      throw new Error(`GET /health failed: ${response.status}`);
    }

    return response.json() as Promise<HealthResponse>;
  }
}
