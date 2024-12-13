import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginServiceService } from "../login-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private loginService: LoginServiceService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.loginService.currentUserValue;
    //console.log('AuthGuard - Utilisateur actuel :', currentUser);
    if (currentUser) {
      // Si l'utilisateur est connecté, il peut accéder aux routes protégées
      return true;
    }
    // Si l'utilisateur n'est pas connecté, redirection vers la page de connexion
    this.router.navigate(['sign-in']);
    return false;
  }
}
