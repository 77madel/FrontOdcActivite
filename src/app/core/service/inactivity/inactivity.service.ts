import { isPlatformBrowser } from '@angular/common';
import {Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import {LoginServiceService} from "../auth/login-service.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {

  private timeoutId: any;
  private readonly inactivityTime: number =  5 * 60 * 1000; //

  constructor(
    private authService: LoginServiceService,
    private ngZone: NgZone,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.startInactivityTimer();
      this.setupEventListeners();
    }
  }

  private startInactivityTimer() {
    this.ngZone.runOutsideAngular(() => {
      this.clearTimeout();
      this.timeoutId = setTimeout(() => this.handleInactivity(), this.inactivityTime);
    });
  }

  private setupEventListeners() {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('mousemove', () => this.resetInactivityTimer());
      document.addEventListener('keydown', () => this.resetInactivityTimer());
      document.addEventListener('click', () => this.resetInactivityTimer());
    }
  }

  private resetInactivityTimer() {
    this.startInactivityTimer();
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private handleInactivity() {
    this.authService.logout();
    alert('Vous avez été déconnecté en raison d\'une inactivité.');
  }
}