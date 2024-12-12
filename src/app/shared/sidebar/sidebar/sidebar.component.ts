import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Location, NgClass, NgForOf, NgIf} from '@angular/common';
import { LoginServiceService } from '../../../core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  host: {
    class: 'sidebar'
  }
})
export class SidebarComponent {
  navItems = [
    { key: 'dashboard', type: 'link', name: 'Dashboard', icon: 'home', link: '/main', roles: [ 'SUPERADMIN'] },
    { key: 'activiteTotal', type: 'link', name: 'Dashboard', icon: 'home', link: '/activiteTotal', roles: ['PERSONNEL']},
    { key: 'entite-odc', type: 'link', name: 'Entités ODC', icon: 'building', link: '/entite-odc', roles: ['SUPERADMIN'] },
    { key: 'employer', type: 'link', name: 'Employés', icon: 'user-tie', link: '/employer', roles: ['SUPERADMIN'] },
    { key: 'role', type: 'link', name: 'Rôles', icon: 'user-shield', link: '/role', roles: ['SUPERADMIN'] },
    { key: 'activity', type: 'link', name: 'Activités', icon: 'tasks', link: '/activity', roles: ['PERSONNEL','SUPERADMIN'] },
    { key: 'typeActivite', type: 'link', name: 'Types d\'Activité', icon: 'th-list', link: '/typeActivite', roles: ['PERSONNEL','SUPERADMIN'] },
    { key: 'critere', type: 'link', name: 'Critères', icon: 'check-circle', link: '/critere', roles: ['PERSONNEL','SUPERADMIN'] },
    { key: 'etape', type: 'link', name: 'Étapes', icon: 'list-ol', link: '/etape', roles: ['PERSONNEL','SUPERADMIN'] },
    { key: 'participants', type: 'link', name: 'Participants', icon: 'users', link: '/participants', roles: ['PERSONNEL','SUPERADMIN'] },
    { key: 'blacklist', type: 'link', name: 'Liste noire', icon: 'ban', link: '/blacklist', roles: ['PERSONNEL','SUPERADMIN'] },
  ];

  userRoles: string[] = [];

  constructor(private router: Router, private location: Location, private loginService: LoginServiceService) {
    this.userRoles = this.loginService.getUserRoles();
    console.log("Rôles de l'utilisateur :", this.userRoles);
  }

  // Vérifie si l'utilisateur a accès à l'élément
  hasAccess(allowedRoles: string[]): boolean {
    return allowedRoles.some(role => this.userRoles.includes(role));
  }

  // Méthode pour récupérer la classe d'icône Font Awesome en fonction du nom
  getIconClass(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      home: 'fas fa-home',
      building: 'fas fa-building',
      'user-tie': 'fas fa-user-tie',
      'user-shield': 'fas fa-user-shield',
      tasks: 'fas fa-tasks',
      'th-list': 'fas fa-th-list',
      'check-circle': 'fas fa-check-circle',
      'list-ol': 'fas fa-list-ol',
      users: 'fas fa-users',
      ban: 'fas fa-ban',
    };
    return iconMap[iconName] || 'fas fa-circle';
  }

  // Méthode pour déconnecter l'utilisateur
  logout() {
    this.loginService.logout();
  }
}
