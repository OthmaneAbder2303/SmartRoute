import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Feature {
  title: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  link: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  // Using BehaviorSubject to keep the features observable
  private featuresSubject = new BehaviorSubject<Feature[]>([
    {
      title: "Planification d'itinéraire",
      shortDescription: "Planifiez vos itinéraires pour économiser du temps et de l'argent.",
      longDescription: "Planifiez vos itinéraires avec une grande précision en économisant du temps, de l'argent et des ressources. Notre outil vous permet de visualiser des options multiples pour vous aider à choisir l'itinéraire le plus optimal en fonction de vos besoins, qu'il s'agisse de réduire le temps de voyage ou d'optimiser les coûts.",
      icon: "/assets/services/planification.png",
      link: "/services/planification"
    },
    {
      title: "Optimisation d'itinéraire",
      shortDescription: "Optimisez vos trajets pour plus d'efficacité.",
      longDescription: "Optimisez vos trajets pour plus d'efficacité en prenant en compte divers paramètres comme le trafic, les conditions météorologiques, et la consommation de carburant. Grâce à notre technologie avancée, vous pourrez générer des itinéraires qui non seulement économisent du temps mais également réduisent les coûts opérationnels.",
      icon: "/assets/services/optimisation.png",
      link: "/services/optimisation"
    },
    {
      title: "Suivi de flotte",
      shortDescription: "Suivez votre flotte de véhicules en temps réel.",
      longDescription: "Analysez et suivez votre flotte de véhicules en temps réel avec des outils de reporting détaillés. Vous pourrez surveiller la performance de chaque véhicule, optimiser l'utilisation de la flotte, et assurer la sécurité de vos conducteurs et de vos marchandises grâce à une surveillance continue.",
      icon: "/assets/services/flotte.png",
      link: "/services/suivi-flotte"
    },
    {
      title: "Gestion des livraisons",
      shortDescription: "Optimisez et gérez vos opérations de livraison.",
      longDescription: "Gérez efficacement vos opérations de livraison en automatisant les processus, en planifiant les tournées, et en optimisant les itinéraires. Vous pourrez suivre chaque livraison en temps réel, garantissant ainsi la satisfaction de vos clients grâce à une exécution rapide et fiable.",
      icon: "/assets/services/livraison.png",
      link: "/services/gestion-livraisons"
    },
    {
      title: "Preuve de livraison",
      shortDescription: "Capturez la preuve de livraison avec e-signature, photo ou code-barres.",
      longDescription: "Capturez la preuve de livraison via e-signature, photo ou code-barres. Ce système vous permet de documenter et de valider chaque étape de la livraison, fournissant une traçabilité complète et une garantie de satisfaction pour vos clients.",
      icon: "/assets/services/preuve.png",
      link: "/services/preuve-livraison"
    },
    {
      title: "Gestion des commandes",
      shortDescription: "Automatisez la gestion de vos commandes pour plus d'efficacité.",
      longDescription: "Automatisez la gestion de vos commandes avec une solution flexible et efficace. Suivez l'état des commandes, gérez les priorités, et coordonnez vos ressources en temps réel pour assurer un service optimal à vos clients.",
      icon: "/assets/services/commande.png",
      link: "/services/gestion-commandes"
    },
    {
      title: "Expérience de livraison",
      shortDescription: "Améliorez la satisfaction client grâce au suivi de livraison.",
      longDescription: "Améliorez la satisfaction de vos clients en offrant une expérience de livraison transparente et suivie. Grâce à notre plateforme, vos clients peuvent suivre leurs livraisons en temps réel, offrant ainsi plus de confort et de visibilité, tout en réduisant les risques de retards ou d'erreurs.",
      icon: "/assets/services/experience.png",
      link: "/services/experience-livraison"
    }
  ]);



  // Expose the features as an observable
  features$ = this.featuresSubject.asObservable();

  // pour modfier les features, ila kan admin matalan
  updateFeatures(features: Feature[]) {
    this.featuresSubject.next(features);
  }
}
