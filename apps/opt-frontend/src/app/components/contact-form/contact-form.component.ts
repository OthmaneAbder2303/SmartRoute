import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent {
  name = '';
  email = '';
  message = '';
  loading = false;
  success: boolean | null = null;

  handleSubmit(): void {
    if (!this.name || !this.email || !this.message) {
      this.success = false;
      return;
    }

    this.loading = true;

    // Envoi de l'email avec EmailJS
    emailjs
      .send(
        'service_oxupapp', // ID de service EmailJS
        'template_kapxdbb', // ID de template EmailJS
        {
          from_name: this.name,
          from_email: this.email,
          message: this.message,
        },
        '5nMHPr55GhijWRoIF' // clé publique EmailJS
      )
      .then(
        () => {
          this.success = true;
          this.name = '';
          this.email = '';
          this.message = '';
        },
        () => {
          this.success = false;
        }
      )
      .finally(() => {
        this.loading = false;
      });
  }
}
