import { Component } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatOption } from "@angular/material/autocomplete";
import { MatSelect } from "@angular/material/select";
import { NgForOf, NgIf } from "@angular/common";
import { Etape, TypeActivite, EtapeService, Activity, Entite, GlobalCrudService, EntiteOdcService } from '../../../core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatCheckbox
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
    private snackBar: MatSnackBar
  ) {
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
    this.isTableVisible = !this.isTableVisible;
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

    console.log('Étapes mises à jour dans l\'activité:', this.activiteToAdd.etape);
  }

  ajouterActivity() {
    if (!this.activiteToAdd.entite) {
      this.snackBar.open("Erreur", "Veuillez sélectionner une entité.", { duration: 3000 });
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
            console.error('Erreur lors de l\'ajout des étapes:', error);
            this.snackBar.open("Erreur", "Erreur lors de l'ajout des étapes.", { duration: 3000 });
          });
        } else {
          this.snackBar.open("Info", "Toutes les étapes sélectionnées sont déjà ajoutées.", { duration: 3000 });
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
      this.snackBar.open("Erreur", "Veuillez sélectionner au moins une étape pour la modification.", {duration: 3000});
      return;
    }

    if (this.isEditMode) {
      this.globalService.update("activite", this.activiteToAdd.id!, this.activiteToAdd).subscribe({
        next: (data: any) => {
          console.log(data);
          this.getAllActivite();
          this.snackBar.open("Succès", "Activité modifiée avec succès.", {duration: 3000});
          this.resetForm();
        },
        error: (err: { error: { message: any; }; }) => {
          console.error(err);
          this.snackBar.open("Erreur", "Erreur lors de la modification de l'activité : " + (err.error?.message || 'Erreur inconnue'), {duration: 3000});
        }
      });
    } else {
      this.globalService.post("activite", this.activiteToAdd).subscribe({
        next: (data: any) => {
          console.log(data);
          this.getAllActivite();
          this.snackBar.open("Succès", "Activité ajoutée avec succès.", {duration: 3000});
          this.resetForm();
        },
        error: (err: { error: { message: any; }; }) => {
          console.error(err);
          this.snackBar.open("Erreur", "Erreur lors de l'ajout de l'activité : " + (err.error?.message || 'Erreur inconnue'), {duration: 3000});
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
        this.snackBar.open("Succès", "Suppression effectuée avec succès.", { duration: 3000 });
        this.getAllActivite();
      },
      error: (err: any) => {
        console.log(err);
        this.snackBar.open("Erreur", "Erreur lors de la suppression.", { duration: 3000 });
      }
    });
  }
}
