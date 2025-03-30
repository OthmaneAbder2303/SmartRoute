import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeKey = 'theme';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.loadTheme();
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      htmlElement.classList.toggle('dark');
      const isDark = htmlElement.classList.contains('dark');
      localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
    }
  }

  loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem(this.themeKey);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }
}
