import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiErrorService } from './core/services/api-error.service';
import { HttpLoadingService } from './core/services/http-loading.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly httpLoadingService = inject(HttpLoadingService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly isLoading = this.httpLoadingService.isLoading;
  readonly errorMessage = this.apiErrorService.message;

  clearGlobalError(): void {
    this.apiErrorService.clear();
  }
}
