export type LoginRequest = {
    email: string;
    password: string;
}

export type LoginResponse = {
    user: {
        id: string;
        email: string;
        name: string;
    },
    token: string;
}

export class AuthClient {
    constructor(private readonly baseUrl: string) {}

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await fetch(`${this.baseUrl}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`POST /api/auth/login failed: ${response.status}`);
        }

        return response.json() as Promise<LoginResponse>;
    }
}