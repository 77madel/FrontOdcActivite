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

  constructor(data?: Partial<Etape>) {
    if (data) {
      Object.assign(this, data);
      this.listeDebut = Array.isArray(data.listeDebut) ? data.listeDebut : data.listeDebut ? [data.listeDebut] : [];
      this.listeResultat = Array.isArray(data.listeResultat) ? data.listeResultat : data.listeResultat ? [data.listeResultat] : [];
    }
  }
}

interface DebutParticipant {
  nom: string;
}

interface ResultatParticipant {
  nom: string;
}
