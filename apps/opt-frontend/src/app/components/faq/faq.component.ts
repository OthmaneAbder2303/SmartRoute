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
  supportFaqs: FAQ[] = [
    { question: 'Comment puis-je contacter le support ?', answer: 'Vous pouvez nous contacter via notre formulaire de contact.', isOpen: false },
    { question: 'Comment réinitialiser mon mot de passe ?', answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion.', isOpen: false },
    { question: 'Où trouver mon historique de trajets ?', answer: 'Accédez à votre compte et consultez la section "Historique".', isOpen: false },
    { question: 'Comment supprimer mon compte ?', answer: 'Allez dans les paramètres du compte et choisissez "Supprimer mon compte".', isOpen: false },
    { question: 'Puis-je changer mon adresse email ?', answer: 'Oui, dans les paramètres de votre compte, sous "Informations personnelles".', isOpen: false },
    { question: 'Comment récupérer une facture ?', answer: 'Les factures sont disponibles dans la section "Mon compte" sous "Facturation".', isOpen: false },
    { question: 'Comment modifier mes informations personnelles ?', answer: 'Rendez-vous dans "Paramètres" et cliquez sur "Modifier le profil".', isOpen: false },
  ];

  routesFaqs: FAQ[] = [
    { question: 'Comment optimiser mes trajets ?', answer: 'Utilisez notre outil d\'optimisation pour trouver les meilleures options de trajets.', isOpen: false },
    { question: 'Puis-je planifier plusieurs arrêts ?', answer: 'Oui, notre outil vous permet de planifier des trajets avec plusieurs arrêts.', isOpen: false },
    { question: 'Comment prendre en compte les embouteillages ?', answer: 'L\'algorithme d\'optimisation prend automatiquement en compte les données de circulation.', isOpen: false },
    { question: 'Comment éviter les péages ?', answer: 'Sélectionnez l\'option "Éviter les péages" lors de la planification.', isOpen: false },
    { question: 'Puis-je utiliser des itinéraires personnalisés ?', answer: 'Oui, vous pouvez enregistrer vos trajets favoris dans l\'application.', isOpen: false },
    { question: 'Comment ajouter un point d\'arrêt en cours de route ?', answer: 'Cliquez sur l\'icône "+" sur la carte et ajoutez votre point d\'arrêt.', isOpen: false },
    { question: 'Puis-je comparer plusieurs trajets ?', answer: 'Oui, l\'outil affiche les options optimales avec le temps et la distance.', isOpen: false },
  ];

  problemsFaqs: FAQ[] = [
    { question: 'Que faire si une route est incorrecte ?', answer: 'Signalez l\'erreur via notre support technique.', isOpen: false },
    { question: 'Pourquoi mon trajet n\'est-il pas optimisé ?', answer: 'Cela peut être dû à des conditions de circulation ou à une carte incorrecte.', isOpen: false },
    { question: 'Que faire si l\'application se bloque ?', answer: 'Essayez de redémarrer l\'application ou de réinstaller si nécessaire.', isOpen: false },
    { question: 'Pourquoi mon GPS ne fonctionne-t-il pas ?', answer: 'Vérifiez que la localisation est activée et que l\'application a les autorisations nécessaires.', isOpen: false },
    { question: 'Que faire si l\'application affiche "Aucune connexion" ?', answer: 'Vérifiez votre réseau ou redémarrez l\'application.', isOpen: false },
    { question: 'Pourquoi la mise à jour des trajets prend-elle du temps ?', answer: 'Cela peut être dû à une connexion Internet lente.', isOpen: false },
    { question: 'Comment signaler un bug ou une anomalie ?', answer: 'Envoyez un rapport depuis l\'application via "Aide > Signaler un problème".', isOpen: false },
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
