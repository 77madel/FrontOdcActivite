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
  etape?: Etape[];
  entite?: Entite;
  typeActivite?: TypeActivite;

  constructor(data?: Partial<Activity>) {
    if (data) {
      Object.assign(this, data);
      this.etape = Array.isArray(data.etape) ? data.etape : data.etape ? [data.etape] : [];
    }
  }
}
