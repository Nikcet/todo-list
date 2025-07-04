export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    TIMEOUT: 10000, // 10 секунд
    RETRY_ATTEMPTS: 3,
} as const;

export const STORAGE_KEYS = {
    ADMIN_TOKEN: 'admin_token',
    USER_PREFERENCES: 'user_preferences',
} as const;

export const PAGINATION = {
    DEFAULT_LIMIT: 3,
    DEFAULT_OFFSET: 0,
    MAX_LIMIT: 100,
} as const;

export const TASK_STATUS = {
    PENDING: false,
    COMPLETED: true,
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
} as const; 