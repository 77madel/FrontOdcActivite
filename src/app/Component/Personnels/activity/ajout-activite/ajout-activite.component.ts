import { Component } from '@angular/core';
import {
  Activity,
  Entite,
  EntiteOdcService,
  Etape,
  EtapeService,
  GlobalCrudService,
  TypeActivite
} from '../../../../core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ajout-activite',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './ajout-activite.component.html',
  styleUrl: './ajout-activite.component.css'
})
export class AjoutActiviteComponent {
  activiteToAdd: Activity = new Activity();
  etape: Etape[] = [];
  entite: Entite[] = [];
  typeActivite: TypeActivite[] = [];

  constructor(
    private globalService: GlobalCrudService,
    private etapeService: EtapeService,
    private entiteService: EntiteOdcService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEntite();
    this.getEtape();
    this.getAllTypeActivite();
  }

  retour(): void {
    this.router.navigate(['./activity']);
  }

  ajouterActivity() {
    if (!this.activiteToAdd.entite) {
      // Gestion des erreurs
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
      error: (err: { error: { message: any; }; }) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: '<span class="text-red-500">Échec</span>',
            text: 'Une erreur est survenue. Veuillez réessayer.',
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
        this.typeActivite = value;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

}
