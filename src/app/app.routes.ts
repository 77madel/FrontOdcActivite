import { Routes } from '@angular/router';
import { AuthGuardService } from './core';
import { AjoutActiviteComponent } from './Component/Personnels/activity/ajout-activite/ajout-activite.component';
import {UpdateActiviteComponent} from './Component/Personnels/activity/update-activite/update-activite.component';

// Détection de l'environnement (SSR ou navigateur)
function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export const routes: Routes = [
  // Redirection par défaut vers 'main' ou 'sign-in' selon l'authentification

  {
    path: '',
    pathMatch: 'full',
    redirectTo: isBrowser() && localStorage.getItem("currentUser") ? 'main' : 'sign-in'
  },
  // Routes publiques (sans AuthGuardService)
  {
    path: 'sign-in',
    loadComponent: () => import('./Component/auth/signin/signin.component').then(c => c.SigninComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./Component/auth/signup/signup.component').then(c => c.SignupComponent)
  },
  {
    path: 'create-account',
    loadComponent: () => import('./Component/auth/create-account/create-account.component').then(c => c.CreateAccountComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./Component/auth/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
  },
  {
    path: 'password-reset',
    loadComponent: () => import('./Component/auth/password-reset/password-reset.component').then(c => c.PasswordResetComponent)
  },
  {
    path: 'set-new-password',
    loadComponent: () => import('./Component/auth/set-new-password/set-new-password.component').then(c => c.SetNewPasswordComponent)
  },
  {
    path: 'done',
    loadComponent: () => import('./Component/auth/done/done.component').then(c => c.DoneComponent)
  },
  // Routes protégées (avec AuthGuardService)
  {
    path: 'main',
    loadComponent: () => import('./Component/main/main.component').then(c => c.MainComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'entite-detail/:id',
    loadComponent: () => import('./Component/admin/entite-detail/entite-detail.component').then(c => c.EntiteDetailComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'entite-odc',
    loadComponent: () => import('./Component/admin/entite-odc/entite-odc.component').then(c => c.EntiteODCComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'role',
    loadComponent: () => import('./Component/admin/role/role.component').then(c => c.RoleComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'employer',
    loadComponent: () => import('./Component/admin/utilisateurs/employer/employer/employer.component').then(c => c.EmployerComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'activity',
    loadComponent: () => import('./Component/Personnels/activity/activity.component').then(c => c.ActivityComponent),
    canActivate: [AuthGuardService]
  },

  {
    path: 'ajout-activite',
    loadComponent: () => import('./Component/Personnels/activity/ajout-activite/ajout-activite.component').then(c => AjoutActiviteComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'update-activite/:id',
    loadComponent: () => import('./Component/Personnels/activity/update-activite/update-activite.component').then(c => UpdateActiviteComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'blacklist',
    loadComponent: () => import('./Component/Personnels/black-list/black-list.component').then(c => c.BlackListComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'critere',
    loadComponent: () => import('./Component/Personnels/critere/critere.component').then(c => c.CritereComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'etape',
    loadComponent: () => import('./Component/Personnels/etape/etape.component').then(c => c.EtapeComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'import',
    loadComponent: () => import('./Component/Personnels/etape/import/import.component').then(c => c.ImportComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'participants',
    loadComponent: () => import('./Component/Personnels/participant/participant.component').then(c => c.ParticipantComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'typeActivite',
    loadComponent: () => import('./Component/Personnels/type-acticite/type-acticite.component').then(c => c.TypeActiciteComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'liste-debut/:id',
    loadComponent: () => import('./Component/Personnels/etape/liste-debut/liste-debut.component').then(c => c.ListeDebutComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'liste-resultat/:id',
    loadComponent: () => import('./Component/Personnels/etape/liste-resultat/liste-resultat.component').then(c => c.ListeResultatComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'activiteTotal',
    loadComponent: () => import('./Component/Personnels/activity/activite-total/activite-total.component').then(c => c.ActiviteTotalComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'salle',
    loadComponent: () => import('./Component/Personnels/salle/salle.component').then(c => c.SalleComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'ajout-salle',
    loadComponent: () => import('./Component/Personnels/salle/add-salle/add-salle.component').then(c => c.AddSalleComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'modifier-salle/:id',
    loadComponent: () => import('./Component/Personnels/salle/update-salle/update-salle.component').then(c => c.UpdateSalleComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'listeGlobal',
    loadComponent: () => import('./Component/Personnels/etape/liste-global/liste-filtre.component').then(c => c.ListeFiltreComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'listeGlobale',
    loadComponent: () => import('./Component/Personnels/etape/listeAffichage/liste-affichage.component').then(c => c.ListeAffichageComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile',
    loadComponent: () => import('./Component/profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [AuthGuardService]
  },
  // Routes d'erreur
  {
    path: 'access-denied',
    title: 'Access Denied',
    loadComponent: () => import('./Component/error/access-denied/access-denied.component').then(c => c.AccessDeniedComponent)
  },
  {
    path: 'internal-server-error',
    title: 'Internal Server Error',
    loadComponent: () => import('./Component/error/internal-server-error/internal-server-error.component').then(c => c.InternalServerErrorComponent)
  },
  // Wildcard route (doit être en dernier)
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () => import('./Component/error/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
