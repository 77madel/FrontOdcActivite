import { Activity } from "./Activity";
import { Critere } from "./Critere";
import { Participant } from "./Participant";

export class Etape {
  id?: number;
  nom?: string;
  listeDebut?: Participant[]; // Doit être un tableau
  listeResultat?: Participant[]; // Doit être un tableau
  statut?: string;
  critere?: Critere;
  selected?: boolean;
}

interface DebutParticipant {
  nom: string;
}

interface ResultatParticipant {
  nom: string;
}
