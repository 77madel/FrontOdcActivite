import {Component, Input} from '@angular/core';
import {Activity, Entite, Etape, EtapeService, GlobalCrudService, TypeActivite} from '../../../../core';
import {Salle} from '../../../../core/model/Salle';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-update-salle',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-salle.component.html',
  styleUrl: './update-salle.component.css'
})
export class UpdateSalleComponent {

  @Input() selectedSalle!: Salle;
  salleToUpdate: Salle = new Salle();
  salleId: any;

  constructor(
    private globalService: GlobalCrudService,
    private snackBar: MatSnackBar,
    private readonly route:ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("Responde data",this.salleId)
    if (this.salleId) {
      this.salleToUpdate = { ...this.selectedSalle };
    }
    this.loadData();
  }

  loadData() {

    this.getAllSalle();
  }


  getAllSalle() {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      // Décrypter l'ID
      const bytes = CryptoJS.AES.decrypt(encryptedId, 'secretKey');
      const decryptedId = bytes.toString(CryptoJS.enc.Utf8);

      if (decryptedId) {
        // L'ID est maintenant décrypté et nous pouvons l'utiliser pour la requête
        this.salleId = parseInt(decryptedId, 10); // Convertir en nombre
        console.log("ID d'activité décrypté:", this.salleId);

        // Requête pour récupérer les détails de l'activité
        this.globalService.get('salle/' + this.salleId).subscribe({
          next: (data: Salle) => {
            this.salleToUpdate = data;
            console.log("Activité à mettre à jour :", this.salleToUpdate);
          },
          error: (error) => {
            console.error('Erreur lors de la récupération de l\'activité:', error);
            // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
          }
        });
      } else {
        console.error('Échec du décryptage de l\'ID');
        // Gérer le cas où le décryptage échoue
      }
    } else {
      console.error('Aucun ID d\'activité fourni.');
      // Gérer le cas où aucun ID n'est fourni
    }
  }

  retour(): void {
    this.router.navigate(['./salle']);
  }

  modifierActivite() {
    if (this.salleToUpdate.id) {
      // const newEtapes = [...this.selectedEtapes];
      // this.activiteToUpdate.etape = Array.from(
      //   new Set([
      //     ...(this.activiteToUpdate.etape || []), // Handle undefined case
      //     ...newEtapes,
      //   ])
      // );

      // Créer un tableau contenant les ID des étapes sélectionnées

      this.globalService.update('salle', this.salleToUpdate.id, this.salleToUpdate).subscribe({
        next: () => {
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
            title: "Modification opérée avec éclat."
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
            message = err.message; // Message générique d'erreur
          } else {
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

}
