import { Component, ElementRef, HostListener, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Feature, FeatureService } from '../../../shared/services/featuresService/feature.service';
import { NewAuthService } from '../../../shared/services/newAuthService/new-auth.service';
import { UserInfo } from '../../../shared/models/auth.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isScrolled = false;
  features: Feature[] = [];
  isServicesOpen = false;
  isRessourcesOpen = false;
  
  user: UserInfo | null = null;
  isAuthenticated = false;
  userFullName: string | null = null;
  isBrowser: boolean;

  private subscriptions: Subscription[] = [];

  constructor(
    public auth: NewAuthService, 
    private featureService: FeatureService, 
    private router: Router, 
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.featureService.features$.subscribe((features) => {
      this.features = features;
    });
    
    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.closeMenus();
        }
      })
    );
    
    this.subscriptions.push(
      this.auth.isAuthenticated().subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        
        // Only try to get user info if authenticated
        if (isAuth) {
          this.loadUserData();
        } else {
          this.user = null;
          this.userFullName = null;
        }
      })
    );
    
    // Handle OAuth redirections if applicable (only in browser)
    if (this.isBrowser) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('token') || urlParams.has('error')) {
        this.auth.handleOAuthRedirect();
      }
    }
  }

  ngOnDestroy() {
    // Clean up all subscriptions when component is destroyed
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadUserData() {
    // Get current user data
    this.subscriptions.push(
      this.auth.getCurrentUser().subscribe({
        next: (user) => {
          this.user = user;
          this.userFullName = `${user.firstname} ${user.lastname}`.trim();
        },
        error: (err) => {
          console.error('Failed to load user data', err);
          // Try to get user info from token as fallback
          const tokenUser = this.auth.getUserInfoFromToken();
          if (tokenUser) {
            this.user = tokenUser;
            this.userFullName = `${tokenUser.firstname} ${tokenUser.lastname}`.trim();
          }
        }
      })
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;
    
    this.isScrolled = window.scrollY > 50; // Adjust as needed
    if (this.isScrolled) {
      document.querySelector('.navbar')?.classList.add('bg-white');
    } else {
      document.querySelector('.navbar')?.classList.remove('bg-white');
    }
  }
  
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.closeMenus();
    }
  }
  
  // Remove duplicate scroll listener (you had two with the same decorator)
  // And make the remaining one SSR-compatible
  
  toggleMenu(menu: 'services' | 'ressources') {
    this.isServicesOpen = menu === 'services' ? !this.isServicesOpen : false;
    this.isRessourcesOpen = menu === 'ressources' ? !this.isRessourcesOpen : false;
  }
  
  private closeMenus() {
    this.isServicesOpen = false;
    this.isRessourcesOpen = false;
  }
}