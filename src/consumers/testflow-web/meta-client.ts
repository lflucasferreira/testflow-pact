export type ApiMeta = {
  name: string;
  version: string;
  documentation: string;
  openapi: string;
};

export class MetaClient {
  constructor(private readonly baseUrl: string) {}

  async getMeta(): Promise<ApiMeta> {
    const response = await fetch(`${this.baseUrl}/api/meta`);

    if (!response.ok) {
      throw new Error(`GET /api/meta failed: ${response.status}`);
    }

    return response.json() as Promise<ApiMeta>;
  }
}
