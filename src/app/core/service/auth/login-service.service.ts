import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UtilFunction } from '../../utils-function';

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

  /**
   * Effectue la connexion de l'utilisateur
   * @param username Nom d'utilisateur
   * @param password Mot de passe
   * @returns Observable de l'utilisateur connecté
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/login`, { username, password })
      .pipe(
        map(user => {
          if (user && user.token && this.isBrowser()) {
            localStorage.setItem('currentUser', JSON.stringify(user));  // Ajout à localStorage
            localStorage.setItem('role', user.role);
            this.currentUserSubject.next(user);
            console.log('Utilisateur actuel :', this.currentUserValue);
          }
          return user;
        }),
        catchError(this.handleError)
      );
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

  /**
   * Déconnecte l'utilisateur
   */
  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('role'); // Supprime aussi le rôle
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
    return !!this.currentUserValue && this.currentUserValue.role === role;
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
  getUserFromLocalStorage(): { bearer?: string, role?: string[], email?: string } | null {
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

  /**
   * Vérifie si le code est exécuté côté navigateur
   * @returns Vrai si on est dans un environnement navigateur
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
