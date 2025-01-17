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
  statut?: string;
  etapes?: Etape[];
  entite?: Entite;
  typeActivite?: TypeActivite;

  constructor(data?: Partial<Activity>) {
    if (data) {
      Object.assign(this, data);
      this.etapes = Array.isArray(data.etapes) ? data.etapes : data.etapes ? [data.etapes] : [];
    }
  }
}
