import { Component } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatOption } from "@angular/material/autocomplete";
import { MatSelect } from "@angular/material/select";
import { CommonModule, NgForOf, NgIf } from "@angular/common";
import {
  Etape,
  TypeActivite,
  EtapeService,
  Activity,
  Entite,
  GlobalCrudService,
  EntiteOdcService,
  LoginServiceService
} from '../../../core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import {MatCheckbox} from "@angular/material/checkbox";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'] // Corrigé de styleUrl à styleUrls
})
export class ActivityComponent {


  activiteList!: Activity[];
  selectedActivite!: Activity;
  activiteToAdd!: Activity;
  etape: Etape[] | undefined;
  entite: Entite[] | undefined;
  typeActivite: TypeActivite[] | undefined;
  userRoles: string[] = [];

  isFormVisible: boolean = false;
  isTableVisible: boolean = true;
  isEditMode = false;

  searchTerm: string = '';
  itemsPerPage = 5; // Nombre d'éléments par page
  currentPage = 1; // Page actuelle

  get filteredActivite() {
    if (!this.activiteList || this.activiteList.length === 0) {
      return []; // Retourner un tableau vide si utilisateurList n'est pas défini ou vide
    }
    if (!this.searchTerm) {
      return this.activiteList;
    }
    return this.activiteList.filter(element =>
      element.nom!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.titre!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.lieu!.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedActivite() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredActivite.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredActivite.length / this.itemsPerPage) || 0; // Retourner 0 si la longueur est 0
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  constructor(
    private globalService: GlobalCrudService,
    private etapeService: EtapeService,
    private entiteService: EntiteOdcService,
    private loginService: LoginServiceService,
    private snackBar: MatSnackBar
  ) {
    this.userRoles = this.loginService.getUserRoles();
    this.activiteToAdd = new Activity();
  }

  ngOnInit(): void {
    this.getAllActivite();
    this.getEtape();
    this.getEntite();
    this.getAllTypeActivite();
  }

  getAllActivite() {
    this.globalService.get("activite").subscribe({
      next: (value: Activity[]) => {
        this.activiteList = value;
        console.log('Response Activite', this.activiteList);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
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

  async getEtape(): Promise<void> {
    try {
      const response = await this.etapeService.get();
      this.etape = response.map((etape: Etape) => ({ ...etape, selected: false }));
    } catch (error) {
      this.snackBar.open("Error", 'Une erreur est survenue lors de la récupération des étapes.', { duration: 3000 });
    }
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

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.isTableVisible = !this.isTableVisible; // Basculer la visibilité de la table

    // Réinitialiser isEditMode à false lorsque le formulaire est fermé
    if (!this.isFormVisible) {
      this.isEditMode = false;
      this.resetForm() // Si vous utilisez un objet `formData`, réinitialisez-le également
    }
  }

  modifierActivite(activite: Activity) {
    this.isEditMode = true;
    this.activiteToAdd = { ...activite };
    this.toggleForm();
  }


  //
  // // Méthode pour mettre à jour les étapes sélectionnées
  // updateSelectedEtapes() {
  //   // Filtrer les étapes qui sont sélectionnées
  //   const selectedEtapes = this.etape!.filter(option => option.selected);
  //
  //   // Mettre à jour les étapes de l'activité
  //   this.activiteToAdd.etape = selectedEtapes.map(etape => ({
  //     id: etape.id,
  //     nom: etape.nom
  //   }));
  //
  //   console.log('Étapes sélectionnées mises à jour dans l\'activité:', this.activiteToAdd.etape);
  // }

  // // Méthode pour mettre à jour les étapes sélectionnées
  // updateSelectedEtapes() {
  //   // Filtrer les étapes qui sont sélectionnées
  //   const selectedEtapes = this.etape!.filter(option => option.selected);
  //
  //   // Mettre à jour les étapes de l'activité en ignorant les propriétés 'status' et 'critere_id'
  //   this.activiteToAdd.etape = selectedEtapes.map(etape => ({
  //     id: etape.id,
  //     nom: etape.nom
  //     // On ignore ici 'status' et 'critere_id'
  //   }));
  //
  //   console.log('Étapes sélectionnées mises à jour dans l\'activité:', this.activiteToAdd.etape);
  // }
  // Ajoutez une propriété pour le mode
  isModificationMode: boolean = false; // initialisé à false pour l'ajout

  updateSelectedEtapes() {
    if (!Array.isArray(this.activiteToAdd.etape)) {
      this.activiteToAdd.etape = [];
    }

    const selectedEtapes = this.etape!.filter(option => option.selected);
    console.log('Étapes sélectionnées:', selectedEtapes);

    this.activiteToAdd.etape = selectedEtapes.map(etape => {
      // @ts-ignore
      const existingEtape = this.activiteToAdd.etape.find(e => e.id === etape.id);

      // Conserver les valeurs existantes pour statut et critere_id
      return {
        id: etape.id,
        nom: etape.nom,
        // Conservez statut de l'étape existante, sinon utilisez celui de l'étape sélectionnée
        statut: existingEtape?.statut ?? etape.statut,
        // Conservez critere_id de l'étape existante, sinon utilisez celui de l'étape sélectionnée
        critere_id: existingEtape?.critere?.id ?? etape.critere?.id
      };
    });

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
  }

  // Vérifie si l'utilisateur a accès à l'élément

  ajouterActivity() {
    if (!this.activiteToAdd.entite) {
      Swal.fire({
        icon: 'info',
        title: '<span class="text-orange-500">Info</span>',
        text: 'Veuillez sélectionner une entité.',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'bg-red-500 text-white hover:bg-red-600',
        },
      });
      return;
    }

    if (this.isModificationMode) {
      const selectedEtapes = this.etape!.filter(option => option.selected);
      console.log('Étapes sélectionnées:', selectedEtapes);

      if (selectedEtapes.length > 0) {
        if (!Array.isArray(this.activiteToAdd.etape)) {
          this.activiteToAdd.etape = [];
        }

        const nouvellesEtapes = selectedEtapes.filter(etape => {
          return !this.activiteToAdd.etape!.some(existingEtape => existingEtape.id === etape.id);
        });

        if (nouvellesEtapes.length > 0) {
          const etapesAvecStatutEtCritere = nouvellesEtapes.map(etape => {
            const existingEtape = this.activiteToAdd.etape?.find(e => e.id === etape.id);
            return {
              id: etape.id,
              nom: etape.nom,
              // Conservez le statut de l'existant, sinon prenez celui de la nouvelle étape
              statut: existingEtape?.statut ?? etape.statut,
              // Conservez le critere_id de l'existant, sinon prenez celui de la nouvelle étape
              critere_id: existingEtape?.critere?.id ?? etape.critere?.id
            };
          });

          this.etapeService.add(etapesAvecStatutEtCritere).then(response => {
            console.log('Étapes ajoutées avec succès:', response);
            if (response && Array.isArray(response)) {
              this.activiteToAdd.etape!.push(...response);
            }
            this.submitActivity();
          }).catch(error => {
            Swal.fire({
              icon: 'error',
              title: '<span class="text-red-500">Échec</span>',
              text: 'Une erreur est survenue. Veuillez réessayer.',
              confirmButtonText: 'Ok',
              customClass: {
                confirmButton: 'bg-red-500 text-white hover:bg-red-600',
              },
            });
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Information',
            text: 'Toutes les étapes sélectionnées sont déjà ajoutées.',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          this.submitActivity();
        }
      } else {
        console.warn('Aucune étape sélectionnée.');
        this.submitActivity();
      }
    } else {
      this.submitActivity();
    }
  }

  submitActivity() {
    if (this.isModificationMode && (!this.activiteToAdd.etape || this.activiteToAdd.etape.length === 0)) {
      Swal.fire({
        icon: 'error',
        title: '<span class="text-red-500">Échec</span>',
        text: 'Veuillez sélectionner au moins une étape pour la modification.',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'bg-red-500 text-white hover:bg-red-600',
        },
      });
      return;
    }

    if (this.isEditMode) {
      this.globalService.update("activite", this.activiteToAdd.id!, this.activiteToAdd).subscribe({
        next: (data: any) => {
          console.log(data);
          this.getAllActivite();
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
          this.resetForm();
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
    } else {
      this.globalService.post("activite", this.activiteToAdd).subscribe({
        next: (data: any) => {
          console.log(data);
          this.getAllActivite();
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
          this.resetForm();
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
  }
  // updateSelectedEtapes() {
  //   this.activiteToAdd.etape = this.etape!.filter(option => option.selected);
  // }


  resetForm() {
    this.isEditMode = false;
    this.activiteToAdd = new Activity();
    this.isFormVisible = false;
    this.isTableVisible = true;
  }

  supprimerActivite(selectedActivite: Activity) {
    this.globalService.delete("activite", selectedActivite.id!).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Eradication diligente pleinement consommée.',
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true
        });
        this.getAllActivite();
      },
      error: (err: any) => {
        console.log(err);
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
}
