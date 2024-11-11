import {Role} from '../model/Role';
import {Entite} from '../model/Entite';

export interface Utilisateur {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  phone?: string;
  genre?: string;
  role?: Role;
  entite?: Entite;
}
