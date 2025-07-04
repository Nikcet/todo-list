import type {
    TaskCreate,
    Task,
    Admin,
    TokenResponse,
    ApiErrorDetails
} from '../types';
import {
    ApiError,
    NetworkError,
    AuthError,
    ValidationError,
    NotFoundError
} from '../errors';
import { API_CONFIG, STORAGE_KEYS, HTTP_STATUS, PAGINATION } from '../config';

export class ApiService {
    private static instance: ApiService;

    private constructor() {}

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    private async onResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})) as ApiErrorDetails;

            switch (response.status) {
                case HTTP_STATUS.UNAUTHORIZED:
                    throw new AuthError(errorData.detail || 'Необходима авторизация', errorData);
                case HTTP_STATUS.NOT_FOUND:
                    throw new NotFoundError(errorData.detail || 'Ресурс не найден', errorData);
                case HTTP_STATUS.UNPROCESSABLE_ENTITY:
                    throw new ValidationError(errorData.detail || 'Ошибка валидации', errorData);
                default:
                    throw new ApiError(
                        errorData.detail || `HTTP ошибка! статус: ${response.status}`,
                        response.status,
                        errorData
                    );
            }
        }

        // Для DELETE запросов может не быть тела ответа
        if (response.status === HTTP_STATUS.NO_CONTENT || response.headers.get('content-length') === '0') {
            return {} as T;
        }

        return await response.json();
    }

    // Базовый метод для выполнения HTTP запросов
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        const token = this.getToken();
        if (token) {
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`,
            };
        }

        try {
            const response = await fetch(url, config);
            return await this.onResponse<T>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new NetworkError(
                `Ошибка сети: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
            );
        }
    }

    // Методы для работы с задачами
    public async createTask(task: TaskCreate): Promise<Task> {
        return this.request<Task>('/task/', {
            method: 'POST',
            body: JSON.stringify(task),
        });
    }

    public async getTask(taskId: string): Promise<Task> {
        return this.request<Task>(`/task/${taskId}`);
    }

    public async updateTask(taskId: string, task: TaskCreate): Promise<Task> {
        return this.request<Task>(`/task/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify(task),
        });
    }

    public async deleteTask(taskId: string): Promise<{ success: boolean }> {
        return this.request<{ success: boolean }>(`/task/${taskId}`, {
            method: 'DELETE',
        });
    }

    public async getTasksCount(): Promise<number> {
        return this.request<number>('/tasks/length');
    }

    public async getTasksPaginated(offset: number = PAGINATION.DEFAULT_OFFSET, limit: number = PAGINATION.DEFAULT_LIMIT): Promise<Task[]> {
        return this.request<Task[]>(`/tasks/?offset=${offset}&limit=${limit}`);
    }

    public async getTasksSortedByUsername(offset: number = PAGINATION.DEFAULT_OFFSET, limit: number = PAGINATION.DEFAULT_LIMIT, reverse: boolean = false): Promise<Task[]> {
        return this.request<Task[]>(`/tasks/sorted/username?offset=${offset}&limit=${limit}&reverse=${reverse}`);
    }

    public async getTasksSortedByEmail(offset: number = PAGINATION.DEFAULT_OFFSET, limit: number = PAGINATION.DEFAULT_LIMIT, reverse: boolean = false): Promise<Task[]> {
        return this.request<Task[]>(`/tasks/sorted/email?offset=${offset}&limit=${limit}&reverse=${reverse}`);
    }

    public async getTasksSortedByStatus(offset: number = PAGINATION.DEFAULT_OFFSET, limit: number = PAGINATION.DEFAULT_LIMIT, reverse: boolean = false): Promise<Task[]> {
        return this.request<Task[]>(`/tasks/sorted/status?offset=${offset}&limit=${limit}&reverse=${reverse}`);
    }

    public async getAllTasks(): Promise<Task[]> {
        return this.request<Task[]>('/tasks');
    }

    // Методы для работы с админами
    public async createAdmin(admin: Admin): Promise<Admin> {
        return this.request<Admin>('/admins/', {
            method: 'POST',
            body: JSON.stringify(admin),
        });
    }

    public async deleteAdmin(adminId: string): Promise<{ success: boolean }> {
        return this.request<{ success: boolean }>(`/admins/${adminId}`, {
            method: 'DELETE',
        });
    }

    public async login(authData: Admin): Promise<TokenResponse> {
        const response = await this.request<TokenResponse>('/admins/auth', {
            method: 'POST',
            body: JSON.stringify(authData),
        });

        // Сохраняем токен
        if (response.access_token) {
            localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, response.access_token);
        }

        return response;
    }

    public logout(): void {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    }

    public isAuthenticated(): boolean {
        return !!this.getToken();
    }

    public getToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    }
} 