import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from "../../shared/services/authService/auth2.service";
import {Router} from "@angular/router";
import { HeroComponent } from '../hero/hero.component';

@Component({
  selector: 'app-callback',
  imports: [CommonModule, HeroComponent],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent {
  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    await this.auth.handleRedirectCallback();
    this.router.navigate(['/']);
  }
}
