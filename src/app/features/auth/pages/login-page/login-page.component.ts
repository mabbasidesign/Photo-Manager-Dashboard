import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    this.error = '';

    const success = this.authService.login(this.username.trim(), this.password);
    if (!success) {
      this.error = 'Invalid credentials. Use demo / demo123';
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/photos';
    void this.router.navigateByUrl(returnUrl);
  }
}
