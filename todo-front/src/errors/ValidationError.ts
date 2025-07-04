import { ApiError } from './ApiError';
import type { ApiErrorDetails } from '../types';

export class ValidationError extends ApiError {
  constructor(message: string = 'Ошибка валидации данных', details?: ApiErrorDetails) {
    super(message, 422, details);
    this.name = 'ValidationError';
  }
} 