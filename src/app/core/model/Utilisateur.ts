import {Entite} from "./Entite";
import {Role} from "./Role";

export class Utilisateur {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  phone?: string;
  genre?: string;
  role?: Role;
  entite?: Entite;
}
