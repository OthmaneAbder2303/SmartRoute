import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NewAuthService } from '../../shared/services/newAuthService/new-auth.service';
import { LoginResponse } from '../../shared/models/auth.models';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  standalone: true,
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  };
  emailMismatch = false;
  errorMessage: string | null = null;
  
  constructor(private newAuthService: NewAuthService, private router: Router) {}
  
  ngOnInit(): void {
    // Vérifier si on est sur une redirection OAuth2
    this.handleOAuthRedirect();
  }
  
  onEmailChange(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailMismatch = !emailPattern.test(this.credentials.email);
  }
  
  login(): void {
    this.errorMessage = null;
    
    this.newAuthService.login(this.credentials).subscribe({
      next: (response: LoginResponse) => {
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
    this.newAuthService.loginWithGoogle();
  }
  
  loginWithGithub(): void {
    this.newAuthService.loginWithGithub();
  }
  
  private handleOAuthRedirect(): void {
    this.newAuthService.handleOAuthRedirect();
    // Si un token est présent, rediriger vers la page principale
    if (this.newAuthService.hasToken()) {
      this.router.navigate(['/map']);
    }
  }
}