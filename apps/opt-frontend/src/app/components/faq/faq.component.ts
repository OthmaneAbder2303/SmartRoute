import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})

export class FaqComponent {
  supportFaqs = [
    { question: 'Comment puis-je contacter le support ?', answer: 'Vous pouvez nous contacter via notre formulaire de contact.', isOpen: false },
    { question: 'Comment réinitialiser mon mot de passe ?', answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion.', isOpen: false },
  ];

  routesFaqs = [
    { question: 'Comment optimiser mes trajets ?', answer: 'Utilisez notre outil d\'optimisation pour trouver les meilleures options de trajets.', isOpen: false },
    { question: 'Puis-je planifier plusieurs arrêts ?', answer: 'Oui, notre outil vous permet de planifier des trajets avec plusieurs arrêts.', isOpen: false },
  ];

  problemsFaqs = [
    { question: 'Que faire si une route est incorrecte ?', answer: 'Signalez l\'erreur via notre support technique.', isOpen: false },
    { question: 'Pourquoi mon trajet n\'est-il pas optimisé ?', answer: 'Cela peut être dû à des conditions de circulation ou à une carte incorrecte.', isOpen: false },
  ];

  toggleFAQ(category: string, i: number) {
    if (category === 'support') {
      this.supportFaqs[i].isOpen = !this.supportFaqs[i].isOpen;
    } else if (category === 'routes') {
      this.routesFaqs[i].isOpen = !this.routesFaqs[i].isOpen;
    } else if (category === 'problems') {
      this.problemsFaqs[i].isOpen = !this.problemsFaqs[i].isOpen;
    }
  }
}
