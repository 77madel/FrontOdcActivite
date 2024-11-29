// Définir une interface pour les éléments de listeDebut
import {Activity} from '../model/Activity';

export interface Person {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  genre: string;
  activite: Activity;
  // Ajoutez d'autres propriétés si nécessaire
}
