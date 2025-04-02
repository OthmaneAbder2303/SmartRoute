import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FaIconComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  standalone: true
})
export class HeroComponent {}
