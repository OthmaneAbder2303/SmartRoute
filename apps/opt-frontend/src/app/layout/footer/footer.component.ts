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
export class FooterComponent {}
