import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewAuthService } from '../../shared/services/newAuthService/new-auth.service';

@Component({
  selector: 'app-oauth-redirect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center min-h-screen bg-white">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p class="text-gray-700">Redirection en cours...</p>
      </div>
    </div>
  `
})
export class OAuthRedirectComponent implements OnInit {
  
  constructor(
    private authService: NewAuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.authService.handleOAuthRedirect();
    
    if (this.authService.hasToken()) {
      this.router.navigate(['/map']);
    } else {
      this.router.navigate(['/login'], { 
        queryParams: { error: 'Échec de l\'authentification OAuth' } 
      });
    }
  }
}