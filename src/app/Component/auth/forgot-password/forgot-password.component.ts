import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {HttpClient} from '@angular/common/http';
import {NgIf} from '@angular/common';
import {LoginServiceService} from '../../../core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    RouterLink,
    ReactiveFormsModule,
    MatIcon,
    FormsModule,
    NgIf
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup; // FormGroup pour gérer le formulaire
  isLoading = false; // État de chargement pour désactiver le bouton pendant la requête

  constructor(private fb: FormBuilder, private http: HttpClient, private loginService: LoginServiceService, private router: Router) {
    // Initialisation du FormGroup avec validation de l'email
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Récupère le contrôle email, avec vérification de nullité
  get email() {
    return this.forgotPasswordForm.get('email');
  }

  // Méthode pour gérer la réinitialisation du mot de passe
  resetPassword() {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading = true; // Active le loader pendant la requête
    this.loginService.requestPasswordReset(this.email?.value).subscribe({
      next: (response) => {
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
          title: "Un email de réinitialisation a été envoyé."
        });
        this.isLoading = false; // Désactive le loader
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: '<span class="text-orange-500">Erreur d\'envoie</span>',
          html: '<p class="text-orange-500">Erreur lors de la demande de réinitialisation.</p>',
          confirmButtonText: 'Réessayer',
          customClass: {
            confirmButton: 'bg-orange-500 text-white hover:bg-orange-600',
          },
        });
        this.isLoading = false; // Désactive le loader
      },
    });
  }
}
