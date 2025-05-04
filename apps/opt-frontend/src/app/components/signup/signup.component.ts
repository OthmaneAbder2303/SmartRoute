import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewAuthService } from '../../shared/services/newAuthService/new-auth.service';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RegisterResponse } from '../../shared/models/auth.models';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
})
export class SignupComponent {
  user= {
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
  
  constructor(private newAuthService: NewAuthService, private router: Router){}
  
  async register() {
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
      const response: RegisterResponse = await firstValueFrom(this.newAuthService.register(this.user));
      console.log('Inscription réussie:', response.message);
      this.router.navigate(['/login']).then(
        (success) => {
          console.log('Navigation to /login successful:', success);
        }).catch((err) => {
          console.error('Navigation to /login failed:', err);
        });
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      this.errorMessage = error.error?.message || 'Échec de l\'inscription, veuillez réessayer.';
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
    this.newAuthService.loginWithGoogle();
  }
  
  loginWithGithub() {
    this.newAuthService.loginWithGithub();
  }
}