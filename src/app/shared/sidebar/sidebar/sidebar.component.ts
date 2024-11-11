import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Location, NgClass, NgForOf} from '@angular/common';
import { LoginServiceService } from '../../../core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
  host: {
    class: 'sidebar'
  }
})
export class SidebarComponent {
  navItems = [
    {
      key: 'dashboard',
      type: 'link',
      name: 'Dashboard',
      icon: 'home',
      link: '/main'
    },
    {
      key: 'entite-odc',
      type: 'link',
      name: 'Entités ODC',
      icon: 'building',
      link: '/entite-odc'
    },
    {
      key: 'employer',
      type: 'link',
      name: 'Employés',
      icon: 'user-tie',
      link: '/employer'
    },
    {
      key: 'role',
      type: 'link',
      name: 'Rôles',
      icon: 'user-shield',
      link: '/role'
    },
    {
      key: 'activity',
      type: 'link',
      name: 'Activités',
      icon: 'tasks',
      link: '/activity'
    },
    {
      key: 'typeActivite',
      type: 'link',
      name: 'Types d\'Activité',
      icon: 'th-list',
      link: '/typeActivite'
    },
    {
      key: 'critere',
      type: 'link',
      name: 'Critères',
      icon: 'check-circle',
      link: '/critere'
    },
    {
      key: 'etape',
      type: 'link',
      name: 'Étapes',
      icon: 'list-ol',
      link: '/etape'
    },
    {
      key: 'participants',
      type: 'link',
      name: 'Participants',
      icon: 'users',
      link: '/participants'
    },
    {
      key: 'blacklist',
      type: 'link',
      name: 'Liste noire',
      icon: 'ban',
      link: '/blacklist'
    },
  ];

  constructor(private router: Router, private location: Location, private loginService: LoginServiceService) {}

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
