import { Utilisateur } from "./Utilisateur";

export class Entite {
  id?: number;
  nom?: string;
  description?: string;
  logo?: string;
  listeDebut?: string;
  listeResultat?: string;
  utilisateur?: Utilisateur;
  responsable?: Utilisateur;
}
