import { Entite } from "./Entite";
import { Etape } from "./Etape";
import { TypeActivite } from "./TypeActivite";

export class Activity{
  id?: number;
  nom?: string;
  titre?: string;
  description?: string;
  lieu?: string;
  objectifParticipation?: number;
  dateDebut?: Date;
  dateFin?: Date;
  etape?: Etape[];
  entite?: Entite;
  typeActivite?: TypeActivite;
}
