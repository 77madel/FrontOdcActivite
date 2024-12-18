import {Component, inject, OnInit} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import {NgIf} from '@angular/common';
import {LoginServiceService} from '../../../core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-set-new-password',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatHint,
    NgIf
  ],
  templateUrl: './set-new-password.component.html',
  styleUrl: './set-new-password.component.scss'
})
export class SetNewPasswordComponent implements OnInit {
  token = '';
  password = '';

  private _router = inject(Router);
  form = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(private route: ActivatedRoute, private http: HttpClient,  private loginService: LoginServiceService) {}

  get passwordValue(): string {
    return this.form.get('password')?.value as string;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token']; // Récupération du token depuis l'URL
    });
  }

  resetPassword() {
    // Vérifier si le formulaire est valide
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    if (!this.token) {
      alert('Token non valide ou manquant.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    // Appel au service pour réinitialiser le mot de passe
    this.loginService.resetPassword(this.token, password!).subscribe({
      next: () => {
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
          title: "La réinitialisation a été effectuée."
        });
        this._router.navigateByUrl('/done'); // Redirection vers une page de succès ou connexion
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: '<span class="text-orange-500">Erreur d\'envoie</span>',
          html: '<p class="text-orange-500">Erreur lors de la réinitialisation.</p>',
          confirmButtonText: 'Réessayer',
          customClass: {
            confirmButton: 'bg-orange-500 text-white hover:bg-orange-600',
          },
        });
      },
    });
  }
}
