export interface Etape {
  id: number; // ou tout autre type d'identifiant
  nom: string;
  selected?: boolean;
  listeDebut: boolean;
  listeResultat: boolean;
}

interface DebutParticipant {
  nom: string;
}

interface ResultatParticipant {
  nom: string;
}


interface Activite {
  nom: string;
  etape: Etape[];
}

interface Participant {
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  activite:{
    id?: number;
    etape: Etape[];
  };
}

