import { ApiError } from './ApiError';
import type { ApiErrorDetails } from '../types';

export class NotFoundError extends ApiError {
  constructor(message: string = 'Ресурс не найден', details?: ApiErrorDetails) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
} 