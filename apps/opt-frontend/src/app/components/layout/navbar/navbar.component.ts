import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Feature, FeatureService } from '../../../shared/services/featuresService/feature.service';
import { NewAuthService } from '../../../shared/services/newAuthService/new-auth.service';
import { UserInfo } from '../../../shared/models/auth.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit{
  isScrolled = false;
  features: Feature[] = [];
  isServicesOpen = false;
  isRessourcesOpen = false;
  user!: UserInfo;

  constructor(public auth: NewAuthService, private featureService: FeatureService, private router: Router, private elementRef: ElementRef) { }

  ngOnInit() {
    this.featureService.features$.subscribe((features) => {
      this.features = features;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeMenus();
      }
    });
    this.auth.getCurrentUser().subscribe({
      next: (user) => this.user = user,
      error: (err) => console.error('User not authenticated', err)
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // Ajuste selon vos besoins
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
  @HostListener('window:scroll', [])
  onScroll(): void {
    this.closeMenus();
  }

  toggleMenu(menu: 'services' | 'ressources') {
    this.isServicesOpen = menu === 'services' ? !this.isServicesOpen : false;
    this.isRessourcesOpen = menu === 'ressources' ? !this.isRessourcesOpen : false;
  }
  private closeMenus() {
    this.isServicesOpen = false;
    this.isRessourcesOpen = false;
  }


}
