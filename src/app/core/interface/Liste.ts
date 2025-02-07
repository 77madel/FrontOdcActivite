// Dans liste.model.ts
import {Etape} from './Etape';

export interface Liste {
  id: number; // Ou string, selon votre ID
  dateHeure: string; // Ou Date, selon votre format
  listeDebut: boolean;
  listeResultat: boolean;
  etape: Etape;
}
