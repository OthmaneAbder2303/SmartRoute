import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NewAuthService } from '../../shared/services/newAuthService/new-auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  standalone: true,
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };
  emailMismatch = false;

  constructor(
    private newAuthService: NewAuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  onEmailChange(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailMismatch = !emailPattern.test(this.credentials.email);
  }

  login(): void {
    this.newAuthService.login(this.credentials).subscribe(
      (response: string) => {
        // Only access localStorage in the browser
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response);
        }
        this.router.navigate(['/map']);
      },
      () => {
        this.router.navigate(['/login']);
      }
    );
  }

  loginWithGoogle(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    } else {
      console.log('Connexion avec Google - Exécution côté serveur, redirection non disponible');
    }
  }

  loginWithGithub(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = 'http://localhost:8080/oauth2/authorization/github';
    } else {
      console.log('Connexion avec GitHub - Exécution côté serveur, redirection non disponible');
    }
  }
}
