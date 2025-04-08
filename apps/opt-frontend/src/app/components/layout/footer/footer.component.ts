import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {

  currentYear: number = new Date().getFullYear();

  refreshPage() {
    window.location.reload();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
