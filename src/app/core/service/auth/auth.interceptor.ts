import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {LoginServiceService} from "./login-service.service";
import {Router} from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(LoginServiceService);  // Injecter le AuthService
  const router = inject(Router); // Injecter le Router

  if(!req.url.includes("/login")){
    const user = authService.getUserFromLocalStorage(); // Récupérer l'utilisateur depuis localStorage
    const token = user?.bearer; // Extraire le token de l'utilisateur s'il est disponible
    // Vérifiez si le token existe
    if (token) {

      // Vérifier si le token est expiré
      const isExpired = authService.isTokenExpired(token);

      if (isExpired) {
        // Si le token est expiré, déconnecter l'utilisateur et rediriger vers la page de connexion
        authService.logout();
        router.navigate(['/sign-in']);
        return next(req); // Pour que l'erreur de déconnexion ne bloque pas la requête
      }

      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Passez la requête clonée au prochain gestionnaire
      return next(clonedReq);
    } else {
      // Passez la requête non modifiée si pas de token
      return next(req);
    }
  }else{
    return next(req);
  }

};
