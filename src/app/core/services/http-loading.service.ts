import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpLoadingService {
  private readonly pendingRequests = signal(0);
  readonly isLoading = computed(() => this.pendingRequests() > 0);

  requestStarted(): void {
    this.pendingRequests.update((count) => count + 1);
  }

  requestFinished(): void {
    this.pendingRequests.update((count) => Math.max(0, count - 1));
  }
}
