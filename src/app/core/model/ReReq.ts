import { Role } from "./Role";
import { Utilisateur } from "./Utilisateur";

export class RepReq {
  username?: string;
  token?: string;
  refreshToken?: string;
  expirationTime?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  phone?: string;
  password?: string;
  roles?: Role;
  utilisateur?: Utilisateur;

}
