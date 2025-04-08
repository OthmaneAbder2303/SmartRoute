import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private newAuthService: NewAuthService, private router: Router) {}

  async register() {
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
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  onPasswordChange() {
    this.passwordMismatch =
      this.user.password !== this.confirmPassword &&
      this.confirmPassword.length > 0;
  }

  onEmailChange() {
    this.emailMismatch =
      this.user.email !== this.confirmEmail && this.confirmEmail.length > 0;
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
