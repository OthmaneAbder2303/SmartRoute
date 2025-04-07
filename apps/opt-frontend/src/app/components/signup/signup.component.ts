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
  user: { username: string; password: string; email: string; roles?: string } = {
    username: '',
    password: '',
    email: '',
    roles: 'USER', // rôle par défaut
  };

  constructor(private newAuthService: NewAuthService, private router: Router) {}

  async register() {
    try {
      await firstValueFrom(this.newAuthService.register(this.user));
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Registration error:', error);
    }
  }
}
