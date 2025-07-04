import type { ApiErrorDetails } from '../types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: ApiErrorDetails
  ) {
    super(message);
    this.name = 'ApiError';
  }
} 