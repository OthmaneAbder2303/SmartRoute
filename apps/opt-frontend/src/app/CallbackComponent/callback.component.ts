import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from "../services/authService/auth2.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-callback',
  imports: [CommonModule],
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
