import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UtilFunction } from '../../utils-function';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private BASE_URL = 'http://localhost:8080';
  currentUserSubject: BehaviorSubject<any | null>;
  public currentUser: Observable<any | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = UtilFunction.isBrowser() ? localStorage.getItem('currentUser') : null;
    this.currentUserSubject = new BehaviorSubject<any | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Accès rapide à la valeur actuelle de l'utilisateur connecté
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  getDecodedToken(token: string): any {
    return jwtDecode(token);
  }

  /**
   * Effectue la connexion de l'utilisateur
   * @param username Nom d'utilisateur
   * @param password Mot de passe
   * @returns Observable de l'utilisateur connecté
   */
  // login(username: string, password: string): Observable<any> {
  //   return this.http.post<any>(`${this.BASE_URL}/auth/login`, { username, password })
  //     .pipe(
  //       map(user => {
  //         if (user && user.bearer && this.isBrowser()) {
  //           localStorage.setItem('currentUser', JSON.stringify(user));
  //           const decoded = this.decodeJwt(user.bearer);
  //           const roles = decoded && decoded.role ? [decoded.role] : [];
  //           localStorage.setItem('roles', JSON.stringify(roles));
  //           this.currentUserSubject.next(user);
  //         }
  //         return user;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/login`, { username, password })
      .pipe(
        map(response => {
          if (response && response.bearer && this.isBrowser()) {
            const user = response.user; // Assurez-vous d'extraire l'utilisateur
            localStorage.setItem('currentUser', JSON.stringify(user));
            const decoded = this.decodeJwt(response.bearer);
            const roles = decoded && decoded.role ? [decoded.role] : [];
            localStorage.setItem('roles', JSON.stringify(roles));
            this.currentUserSubject.next(user); // Mettez à jour le BehaviorSubject avec l'utilisateur
          }
          return response; // Retourne la réponse originale
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Décode un token JWT et retourne la charge utile
   * @param token Le token JWT à décoder
   * @returns La charge utile du JWT ou null en cas d'erreur
   */
  private decodeJwt(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du JWT', error);
      return null;
    }
  }

  /**
   * Gère les erreurs HTTP
   * @param error L'erreur HTTP
   * @returns Observable de l'erreur formatée
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Erreurs côté client
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Erreurs côté serveur
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  // Vérifier si le token est expiré
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Décodage du payload
      const expirationDate = payload.exp * 1000; // Conversion en millisecondes
      return Date.now() > expirationDate;
    } catch (error) {
      return true; // Si le token est mal formé ou invalide
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('roles'); // Supprime aussi le rôle
    }
    this.currentUserSubject.next(null); // Met à jour l'utilisateur connecté à null
    this.router.navigate(['sign-in']); // Redirige vers la page de connexion
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param role Le rôle à vérifier
   * @returns Vrai si l'utilisateur a le rôle
   */
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  /**
   * Récupère l'email de l'utilisateur connecté
   * @returns L'email de l'utilisateur ou null
   */
  getUsername(): string | null {
    const user = this.currentUserValue;
    return user ? user.email : null;
  }

  /**
   * Récupère les informations utilisateur depuis le localStorage
   * @returns L'objet utilisateur ou null
   */
  getUserFromLocalStorage(): { bearer?: string, role?: string[], email?: string, id?: number } | null {
    let user = null;

    if (UtilFunction.isBrowser()) {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        user = JSON.parse(userStr);
      } else {
        console.log('No currentUser found in localStorage');
      }
    }
    return user;
  }

  getUserpourprofilFromLocalStorage(): { id?: number, email?: string, role?: string } | null {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.bearer) {
          const decodedToken = this.getDecodedToken(user.bearer);
          return {
            id: decodedToken.id,
            email: decodedToken.sub,
            role: decodedToken.role,
          };
        }
      } catch (error) {
        console.error('Erreur lors du parsing de localStorage ou du décodage du token:', error);
      }
    }
    return null;
  }

  getUserData(token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get(`${this.BASE_URL}/utilisateur`, { headers });
  }

  /**
   * Vérifie si le code est exécuté côté navigateur
   * @returns Vrai si on est dans un environnement navigateur
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  /**
   * Récupère les rôles de l'utilisateur connecté
   * @returns Tableau des rôles ou tableau vide
   */
  getUserRoles(): string[] {
    if (this.isBrowser()) {
      const roles = localStorage.getItem('roles');
      return roles ? JSON.parse(roles) : [];
      console.log(roles)
    }
    return [];
  }

  /**
   * Demande de réinitialisation de mot de passe
   * @param email - L'adresse email de l'utilisateur
   * @returns Observable pour suivre l'état de la requête
   */
  requestPasswordReset(email: string): Observable<any> {
    const url = `${this.BASE_URL}/auth/request-password-reset`;
    const payload = { email };
    return this.http.post<{ message: string }>(url, payload).pipe(
      map(response => {
        console.log(response.message); // Assurez-vous d'utiliser la clé JSON correcte
        return response.message;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Réinitialisation du mot de passe avec un nouveau mot de passe
   * @param token - Jeton reçu par email
   * @param newPassword - Le nouveau mot de passe
   * @returns Observable pour suivre l'état de la requête
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    const url = `${this.BASE_URL}/auth/reset-password`;
    const payload = { token, newPassword };
    return this.http.post(url, payload).pipe(
      map((response) => {
        console.log('Réponse du backend :', response);
        // Vérifie que le backend a retourné un message
        return response;
      }),
      catchError((error) => {
        console.error('Erreur reçue:', error);
        throw error;
      }),
    );
  }
}
