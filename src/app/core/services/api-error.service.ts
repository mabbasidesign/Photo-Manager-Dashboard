import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  readonly message = signal('');

  setError(message: string): void {
    this.message.set(message);
  }

  clear(): void {
    this.message.set('');
  }
}
