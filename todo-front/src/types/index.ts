export interface Task {
    id: string;
    username: string;
    email: string;
    text: string;
    status: boolean;
    edited_by_admin?: boolean;
}

export interface TaskCreate {
    username: string;
    email: string;
    text: string;
    status?: boolean;
    edited_by_admin?: boolean;
}

export interface Admin {
    username: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    offset: number;
    limit: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface ApiErrorDetails {
    detail?: string;
    status_code?: number;
    [key: string]: any;
} 