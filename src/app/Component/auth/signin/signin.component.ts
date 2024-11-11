import { Component, Inject, NgZone,ChangeDetectorRef, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import {isPlatformBrowser, NgIf, NgOptimizedImage} from '@angular/common';
import { LoginServiceService } from '../../../core';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatIconButton,
    MatSuffix,
    FormsModule,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isConnected: boolean = false;
  currentYear: number = new Date().getFullYear();

  constructor(
    private readonly loginService: LoginServiceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isConnected = !!localStorage.getItem('currentUser');
    }
  }

  login() {
    if (!this.username || !this.password) {
      this.showError("Email et mot de passe sont requis.");
      return;
    }

    this.loginService.login(this.username, this.password).subscribe({
      next: response => {
        const token = response.bearer;
        console.log("DANS SIGNIN COMPO", token);

        if (isPlatformBrowser(this.platformId) && token) {
          localStorage.setItem("currentUser", JSON.stringify(response));
          localStorage.setItem("role", response.role ? response.role[0] : '');
          this.snackBar.open("Connexion réussie.", "Succès", { duration: 4000 });

          // Utiliser NgZone pour naviguer
          this.router.navigateByUrl('/main').then(() => {
            this.cdRef.detectChanges();
          });
        } else {
          console.log('else');
          this.snackBar.open("Aucun token reçu dans la réponse.", "Erreur", { duration: 4000 });
        }

        this.resetForm();
      },
      error: error => {
        console.error('Erreur de connexion :', error);
        this.snackBar.open("Nom d'utilisateur ou mot de passe incorrect", "Erreur", { duration: 4000 });
        this.resetForm();
      }
    });
  }

  private resetForm() {
    this.username = '';
    this.password = '';
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }
}
