import { Component, Inject, NgZone,ChangeDetectorRef, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import {isPlatformBrowser, NgIf, NgOptimizedImage} from '@angular/common';
import { LoginServiceService } from '../../../core';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgIf,
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
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isConnected = !!localStorage.getItem('currentUser');
    }
  }

  // login() {
  //   if (!this.username || !this.password) {
  //     this.showError("Email et mot de passe sont requis.");
  //     return;
  //   }
  //
  //   this.loginService.login(this.username, this.password).subscribe({
  //     next: response => {
  //       const token = response.bearer;
  //
  //       if (isPlatformBrowser(this.platformId) && token) {
  //         localStorage.setItem("currentUser", JSON.stringify(response));
  //         const roles = this.loginService.getUserRoles();
  //         this.loginService.currentUserSubject.next(response); // Assurez-vous que le service est mis à jour
  //         this.router.navigateByUrl('/main').then(() => {
  //           this.cdRef.detectChanges();
  //         });
  //         const Toast = Swal.mixin({
  //           toast: true,
  //           position: "top-end",
  //           showConfirmButton: false,
  //           timer: 3000,
  //           timerProgressBar: true,
  //           didOpen: (toast) => {
  //             toast.onmouseenter = Swal.stopTimer;
  //             toast.onmouseleave = Swal.resumeTimer;
  //           }
  //         });
  //         Toast.fire({
  //           icon: "success",
  //           title: "L’entrelacement de vos identifiants a triomphalement abouti"
  //         });
  //       } else {
  //         this.snackBar.open("Aucun token reçu dans la réponse.", "Erreur", { duration: 4000 });
  //       }
  //
  //       this.resetForm();
  //     },
  //     error: error => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: '<span class="text-orange-500">Erreur d\'authentification</span>',
  //         html: '<p class="text-orange-500">L’identifiant ou le cryptonyme fourni ne concorde point avec les enregistrements consignés dans nos registres sécurisés. Veuillez vérifier l’exactitude des informations saisies et réitérer votre tentative.</p>',
  //         confirmButtonText: 'Réessayer',
  //         customClass: {
  //           confirmButton: 'bg-orange-500 text-white hover:bg-orange-600',
  //         },
  //       });
  //       this.resetForm();
  //     }
  //   });
  // }

  login() {
    if (!this.username || !this.password) {
      this.showError("Email et mot de passe sont requis.");
      return;
    }

    this.loginService.login(this.username, this.password).subscribe({
      next: response => {
        const token = response.bearer;

        if (isPlatformBrowser(this.platformId) && token) {
          localStorage.setItem("currentUser", JSON.stringify(response));
          const roles = this.loginService.getUserRoles(); // Assurez-vous que les rôles sont extraits ici
          this.loginService.currentUserSubject.next(response); // Mettre à jour le service

          // Redirection en fonction du rôle
          if (roles.includes('SUPERADMIN')) {
            this.router.navigateByUrl('/main').then(() => {
              this.cdRef.detectChanges();
            });
          } else if (roles.includes('PERSONNEL')) {
            this.router.navigateByUrl('/activiteTotal').then(() => {
              this.cdRef.detectChanges();
            });
          }
          // else {
          //   this.router.navigateByUrl('/main').then(() => {
          //     this.cdRef.detectChanges();
          //   });
          // }

          // Affichage du toast de succès
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "L’entrelacement de vos identifiants a triomphalement abouti"
          });
        } else {
          this.snackBar.open("Aucun token reçu dans la réponse.", "Erreur", { duration: 4000 });
        }

        this.resetForm();
      },
      error: error => {
        Swal.fire({
          icon: 'error',
          title: '<span class="text-orange-500">Erreur d\'authentification</span>',
          html: '<p class="text-orange-500">L’identifiant ou le cryptonyme fourni ne concorde point avec les enregistrements consignés dans nos registres sécurisés. Veuillez vérifier l’exactitude des informations saisies et réitérer votre tentative.</p>',
          confirmButtonText: 'Réessayer',
          customClass: {
            confirmButton: 'bg-orange-500 text-white hover:bg-orange-600',
          },
        });
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
