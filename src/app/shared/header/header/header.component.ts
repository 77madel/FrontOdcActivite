import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {SearchBarComponent} from '../../../search-bar/search-bar.component';

@Component({
    selector: 'app-header',
  imports: [RouterLink, SearchBarComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input()
  sidebarHidden = false;

  toggleSidebar(): void {
    this.sidebarHidden = !this.sidebarHidden;
  }

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  notificationsOpen = false;
  profileMenuOpen = false;

  constructor(private router: Router) {
    const storedUser = this.isBrowser() ? localStorage.getItem('currentUser') : null;
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token'); // Supprimer le token aussi
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/sign-in']);
  }

  getNom(): string | null {
    let user = this.currentUserSubject.value;
    return user ? user.nom : null;
  }

  getPrenom(): string | null {
    let user = this.currentUserSubject.value;
    return user ? user.prenom : null;
  }

  getUsername(): string | null {
    let user = this.currentUserSubject.value;
    return user ? user.username : null;
  }

  // Méthodes pour gérer l'affichage des menus déroulants
  toggleNotifications() {
    this.notificationsOpen = !this.notificationsOpen;
    this.profileMenuOpen = false; // Ferme le menu profil si ouvert
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
    this.notificationsOpen = false; // Ferme le menu notifications si ouvert
  }
}
