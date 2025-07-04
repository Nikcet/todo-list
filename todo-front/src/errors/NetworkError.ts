import { ApiError } from './ApiError';

export class NetworkError extends ApiError {
  constructor(message: string = 'Ошибка сети') {
    super(message, 0);
    this.name = 'NetworkError';
  }
} 