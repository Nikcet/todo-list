import { ApiError } from './ApiError';
import type { ApiErrorDetails } from '../types';

export class AuthError extends ApiError {
  constructor(message: string = 'Ошибка авторизации', details?: ApiErrorDetails) {
    super(message, 401, details);
    this.name = 'AuthError';
  }
} 