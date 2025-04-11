import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NewAuthService } from '../../shared/services/newAuthService/new-auth.service';
import { LoginResponse } from '../../shared/models/auth.models';

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
  errorMessage: string | null = null;

  constructor(private newAuthService: NewAuthService, private router: Router) {}

  onEmailChange(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailMismatch = !emailPattern.test(this.credentials.email);
  }

  login(): void {
    this.errorMessage = null;

    this.newAuthService.login(this.credentials).subscribe({
      next: (response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/map']).then((success) => {
          console.log('Navigation to /map successful:', success);
        }).catch((err) => {
          console.error('Navigation to /map failed:', err);
        });
      },
      error: (err) => {
        console.error('Erreur lors de la connexion:', err);
        this.errorMessage = err.error?.message || 'Échec de la connexion, veuillez vérifier vos identifiants.';
        this.router.navigate(['/']).then((success) => {
          console.log('Navigation to / successful:', success);
        }).catch((err) => {
          console.error('Navigation to / failed:', err);
        });
      },
    });
  }

  loginWithGoogle(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    // } else {
    //   console.log('Connexion avec Google - Exécution côté serveur, redirection non disponible');
    // }
  }

  loginWithGithub(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   window.location.href = 'http://localhost:8080/oauth2/authorization/github'; //après
    // } else {
    //   console.log('Connexion avec GitHub - Exécution côté serveur, redirection non disponible');
    // }
  }
}
