export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
}

export type UsersResponse = {
    users: User[];
    total: number;
}

export class UsersClient {
    constructor(private readonly baseUrl: string) {}

    async getUsers(): Promise<UsersResponse> {
        const response = await fetch(`${this.baseUrl}/api/users`);

        if (!response.ok) {
            throw new Error(`GET /api/users failed: ${response.status}`);
        }

        return response.json() as Promise<UsersResponse>;
    }
}