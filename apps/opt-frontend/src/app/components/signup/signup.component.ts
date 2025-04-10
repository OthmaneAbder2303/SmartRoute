import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewAuthService } from '../../shared/services/newAuthService/new-auth.service';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
})
export class SignupComponent {
  user: {
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    roles?: string;
  } = {
    firstname: '',
    lastname: '',
    password: '',
    email: '',
    roles: 'USER',
  };
  confirmPassword = '';
  confirmEmail = '';
  passwordMismatch = false;
  emailMismatch = false;
  errorMessage: string | null = null;

  constructor(
    private newAuthService: NewAuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  async register(): Promise<void> {
    this.errorMessage = null;

    if (this.user.email !== this.confirmEmail) {
      this.emailMismatch = true;
      return;
    }
    this.emailMismatch = false;

    if (this.user.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;

    try {
      await firstValueFrom(this.newAuthService.register(this.user));
      console.log('Inscription réussie');

      // Navigate to login page (only in browser environment)
      if (isPlatformBrowser(this.platformId)) {
        this.router.navigate(['/login']).then((success) => {
          console.log('Navigation to /login successful:', success);
        }).catch((err) => {
          console.error('Navigation to /login failed:', err);
        });
      } else {
        console.log('Navigation skipped on server-side');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      this.errorMessage = 'Échec de l\'inscription, veuillez réessayer.';
    }
  }

  onPasswordChange() {
    this.passwordMismatch =
      this.user.password !== this.confirmPassword &&
      this.confirmPassword.length > 0;
  }

  onEmailChange() {
    //const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailMismatch =
      this.user.email !== this.confirmEmail && this.confirmEmail.length > 0; //&& !emailPattern.test(this.user.email);
  }

  loginWithGoogle() {
    console.log('Login with Google');
    // Implémenter la logique de connexion avec Google
  }

  loginWithGithub() {
    console.log('Login with Github');
    // Implémenter la logique de connexion avec Github
  }
}
