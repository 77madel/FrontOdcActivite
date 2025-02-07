import { afterNextRender, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {isPlatformBrowser, NgIf} from '@angular/common';
import { filter } from 'rxjs';
import {InactivityService, LoginServiceService} from './core';
import { HeaderComponent } from './shared/header/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        HeaderComponent,
        SidebarComponent,
        NgIf
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'odcActivity';

  private _platformId = inject(PLATFORM_ID);
  private _router = inject(Router);

  loadingText = signal('Application Loading');
  pageLoaded = signal(false);
  isLoggedIn = signal(false); // Ajoutez ce signal pour suivre l'état de connexion

  constructor(
    private loginService: LoginServiceService,// Injectez votre service d'authentification
    private inactivityService: InactivityService
  ) {
    afterNextRender(() => {
      // Scroll à la page du haut si l'URL change
      this._router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          window.scrollTo({ top: 0, left: 0 });
          setTimeout(() => {
            this.pageLoaded.set(true);
          }, 3000);
        });
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      setTimeout(() => {
        this.loadingText.set('Initializing Modules');
      }, 1500);
    }

    // Abonnez-vous à l'état de connexion de l'utilisateur
    this.loginService.currentUser.subscribe(user => {
      this.isLoggedIn.set(!!user);
    });
  }
}
