import { Activity } from "./Activity";
import { Etape } from "./Etape";
import { Utilisateur } from "./Utilisateur";

export class Participant {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  phone?: string;
  genre?: string;
  activite?: Activity;// Permettre que ce soit null
  isBlacklisted?: boolean;
  checkedIn?: boolean;
  checkInTime?: Date | null;
}


export interface Participant {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  phone?: string;
  genre?: string;
  activite?: Activity; // Permettre que ce soit null
  isBlacklisted?: boolean;
  checkedIn?: boolean;
  checkInTime?: Date | null;
}
