import { Component, Input, OnInit } from '@angular/core';
import { Activity, Entite, Etape, EtapeService, GlobalCrudService, TypeActivite } from '../../../../core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import {Salle} from '../../../../core/model/Salle';

@Component({
  selector: 'app-update-activite',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './update-activite.component.html',
  styleUrls: ['./update-activite.component.css']
})
export class UpdateActiviteComponent implements OnInit {
  @Input() selectedActivite!: Activity;
  activiteToUpdate: Activity = new Activity();
  etapes: Etape[] = [];
  entite: Entite[]=[];
  typeActivite: TypeActivite[] = [];
  activityId: any;
  selectedEtapes: Etape[] = [];
  salleId: Salle[] = [];

  constructor(
    private globalService: GlobalCrudService,
    private snackBar: MatSnackBar,
    private etapeService: EtapeService,
    private readonly route:ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("Responde data",this.activityId)
    if (this.selectedActivite) {
      this.activiteToUpdate = { ...this.selectedActivite };
    }
    this.loadData();
  }

  loadData() {
    this.getEtape();
    this.getEntite();
    this.getAllTypeActivite();
    this.getAllActivite();
    this.getSalle();
  }

  // getAllActivite() {
  //   this.activityId = this.route.snapshot.paramMap.get('id')
  //   if (this.activityId) {
  //
  //     this.globalService.get('activite/' + this.activityId).subscribe({
  //       next: (data: Activity) => {
  //         this.activiteToUpdate = data;
  //         console.log("Activité à mettre à jour :", this.activiteToUpdate);
  //       },
  //       error: (error) => {
  //         console.error('Erreur lors de la récupération de l\'activité:', error);
  //         // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
  //       }
  //     });
  //   } else {
  //     console.error('Aucun ID d\'activité fourni.');
  //     // Gérer le cas où aucun ID n'est fourni, par exemple rediriger vers une autre page
  //   }
  // }

  getAllActivite() {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      // Décrypter l'ID
      const bytes = CryptoJS.AES.decrypt(encryptedId, 'secretKey');
      const decryptedId = bytes.toString(CryptoJS.enc.Utf8);

      if (decryptedId) {
        // L'ID est maintenant décrypté et nous pouvons l'utiliser pour la requête
        this.activityId = parseInt(decryptedId, 10); // Convertir en nombre
        console.log("ID d'activité décrypté:", this.activityId);

        // Requête pour récupérer les détails de l'activité
        this.globalService.get('activite/' + this.activityId).subscribe({
          next: (data: Activity) => {
            this.activiteToUpdate = data;
            console.log("Activité à mettre à jour :", this.activiteToUpdate);
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

  async getEtape(): Promise<void> {
    try {
      const response = await this.etapeService.get();
      this.etapes = response.map((e: Etape) => ({ ...e, selected: false }));
    } catch (error) {
      this.snackBar.open('Erreur lors de la récupération des étapes.', 'Fermer', { duration: 3000 });
    }
  }

  getEntite() {
    this.globalService.get('entite').subscribe(entites => {
      this.entite = entites;
      // Si vous avez une entité par défaut, vous pouvez la pré-sélectionner ici
      this.activiteToUpdate.entite = entites[0].id; // Par exemple
    });
  }

  getSalle() {
    this.globalService.get('salle').subscribe(salleId => {
      this.salleId = salleId;
      // Si vous avez une entité par défaut, vous pouvez la pré-sélectionner ici
      this.activiteToUpdate.salleId = salleId[0].id; // Par exemple
    });
  }

  getAllTypeActivite() {
    this.globalService.get('typeActivite').subscribe({
      next: (data) => {
        this.typeActivite = data;
      },
      error: (error) => {
        console.error('Error fetching activity types:', error);
      }
    });
  }

  retour(): void {
    this.router.navigate(['./activity']);
  }



  selectedEtapeIds: number[] = [];
  onEtapesChange() {
    console.log('Etapes sélectionnées ont changé:', this.selectedEtapeIds);

    // Filter étapes based on existence and selected ID inclusion
    const filteredEtapes = this.etapes.filter(etape => etape && this.selectedEtapeIds.includes(etape.id!));

    // Assign filtered étapes to activiteToUpdate.etapes (assuming it's an array)
    this.activiteToUpdate.etapes = filteredEtapes;
  }
  modifierActivite() {
    if (this.activiteToUpdate.id) {
      // const newEtapes = [...this.selectedEtapes];
      // this.activiteToUpdate.etape = Array.from(
      //   new Set([
      //     ...(this.activiteToUpdate.etape || []), // Handle undefined case
      //     ...newEtapes,
      //   ])
      // );

      // Créer un tableau contenant les ID des étapes sélectionnées
      const selectedEtapeIds = this.selectedEtapes.map(etape => etape.id);

      this.globalService.update('activite', this.activiteToUpdate.id, this.activiteToUpdate).subscribe({
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
