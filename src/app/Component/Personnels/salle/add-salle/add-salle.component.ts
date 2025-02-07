import { Component } from '@angular/core';
import {
  Activity,
  Entite,
  EntiteOdcService,
  Etape,
  EtapeService,
  GlobalCrudService, LoginServiceService,
  TypeActivite
} from '../../../../core';
import {Salle} from '../../../../core/model/Salle';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-add-salle',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-salle.component.html',
  styleUrl: './add-salle.component.css'
})
export class AddSalleComponent {

  salles: Salle = new Salle();


  constructor(
    private globalService: GlobalCrudService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit(): void {

  }

  retour(): void {
    this.router.navigate(['./salle']);
  }



  addSalle() {
    if (!this.salles) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs requis',
        text: 'Veuillez remplir tout les champs avant de continuer.',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'bg-yellow-500 text-white hover:bg-yellow-600',
        },
      });
      return;
    }
    // Ajouter l'activité
    this.globalService.post('salle', this.salles).subscribe({
      next: (response) => {
        console.log(response);
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
          title: "Adjonction réalisée avec un succès éclatant."
        });
        this.retour();
      },
      error: (err: { status: number; error: any; message?: string }) => {
        console.error('Erreur reçue:', err);

        let message = 'Une erreur est survenue. Veuillez réessayer.'; // Message par défaut
        let title = '<span class="text-red-500">Échec</span>';

        // Extraire le message d'erreur selon la structure réelle
        if (err.error?.message) {
          message = err.error.message; // Message spécifique du backend
        } else if (err.message) {
          message = err.message;
        }// Message générique d'erreur
        else {
          // Utiliser un message générique si aucune info spécifique n'est disponible
          message = 'Erreur inconnue. Veuillez réessayer.';
        }

        // Afficher l'alerte
        Swal.fire({
          icon: 'error',
          title: title,
          text: message, // Afficher uniquement le message
          confirmButtonText: 'Ok',
          customClass: {
            confirmButton: 'bg-red-500 text-white hover:bg-red-600',
          },
        });
      }
    });
  }


}
