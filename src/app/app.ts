import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiErrorService } from './core/services/api-error.service';
import { AuthService } from './core/services/auth.service';
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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = this.httpLoadingService.isLoading;
  readonly errorMessage = this.apiErrorService.message;
  readonly isAuthenticated = this.authService.isAuthenticated;

  clearGlobalError(): void {
    this.apiErrorService.clear();
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
