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
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {Salle} from '../../../../core/model/Salle';

@Component({
    selector: 'app-ajout-activite',
    imports: [
        FormsModule,
        NgForOf,
        ReactiveFormsModule
    ],
    templateUrl: './ajout-activite.component.html',
    styleUrl: './ajout-activite.component.css'
})
export class AjoutActiviteComponent {
  activiteToAdd: Activity = new Activity();
  etape: Etape[] = [];
  entite: Entite[] = [];
  // typeActivite: TypeActivite[] = [];
  allTypeActivite: TypeActivite[] = []; // Garder tous les types d'activités
  filteredTypeActivite: TypeActivite[] = []; // Types d'activités filtrés pour l'entité sélectionnée
  salleId: Salle[] = [];
  userRoles: string[] = [];

  constructor(
    private globalService: GlobalCrudService,
    private etapeService: EtapeService,
    private entiteService: EntiteOdcService,
    private snackBar: MatSnackBar,
    private router: Router,
    private loginService: LoginServiceService
  ) {
    this.userRoles = this.loginService.getUserRoles();
  }

  ngOnInit(): void {
    this.getEntite();
    this.getEtape();
    this.getAllTypeActivite();
    this.getSalle();
  }

  retour(): void {
    this.router.navigate(['./activity']);
  }

  ajouterActivity() {
    if (!this.activiteToAdd.salleId) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs requis',
        text: 'Veuillez sélectionner une salle avant de continuer.',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'bg-yellow-500 text-white hover:bg-yellow-600',
        },
      });
      return;
    }
    // Ajouter l'activité
    this.globalService.post('activite', this.activiteToAdd).subscribe({
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
          message = err.message; // Message générique d'erreur
        } else if (err.status === 409) {
          Swal.fire('Conflit', 'La salle est déjà réservée pour ce créneau.', 'error');
        }
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

  getEntite() {
    this.globalService.get("entite").subscribe({
      next: (value) => {
        this.entite = value;
        console.log("Response Entite", this.entite);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getSalle() {
    this.globalService.get("salle").subscribe({
      next: (value) => {
        this.salleId = value;
        console.log("Response Salle", this.salleId);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  async getEtape(): Promise<void> {
    try {
      const response = await this.etapeService.get();
      this.etape = response.map((etape: Etape) => ({ ...etape, selected: false }));
    } catch (error) {
      this.snackBar.open("Error", 'Une erreur est survenue lors de la récupération des étapes.', { duration: 3000 });
    }
  }

  getAllTypeActivite() {
    this.globalService.get("typeActivite").subscribe({
      next: (value) => {
        this.allTypeActivite = value;
        this.filteredTypeActivite = [...this.allTypeActivite]; // Initialiser avec tous les types
        console.log("Filter", this.filteredTypeActivite)

      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }


  onEntiteChange(event: any): void {
    const entiteId = Number(event.target.value);
    if (entiteId) {
      this.globalService.getId("typeActivite/by-entite", entiteId).subscribe(
        (data) => {
          this.filteredTypeActivite = data;
          console.log("TypeActivités filtrées :", data);
        },
        (error) => {
          console.error("Erreur chargement typeActivites:", error);
          this.filteredTypeActivite = [];
        }
      );
    } else {
      this.filteredTypeActivite = [];
    }
  }




}
