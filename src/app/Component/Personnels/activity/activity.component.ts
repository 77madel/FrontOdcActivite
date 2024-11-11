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

  // Méthode pour mettre à jour les étapes sélectionnées
  async updateSelectedEtapes() {
    // Créer un objet à partir des étapes sélectionnées
    const selectedEtape = this.etape!.find(option => option.selected);
    if (selectedEtape) {
      try {
        const response = await this.etapeService.add([selectedEtape]);
        console.log('Étape ajoutée avec succès:', response);
      } catch (err) {
        console.error('Erreur lors de l\'ajout de l\'étape:', err);
      }
    }
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


  // Ajoutez une propriété pour le mode
  isModificationMode: boolean = false; // initialisé à false pour l'ajout

  ajouterActivity() {
    // Vérifiez que l'entité est sélectionnée
    if (!this.activiteToAdd.entite) {
      this.snackBar.open("Erreur", "Veuillez sélectionner une entité.", { duration: 3000 });
      return;
    }

    // Vérifiez si nous sommes en mode de modification
    if (this.isModificationMode) {
      // Récupérer toutes les étapes sélectionnées
      const selectedEtapes = this.etape!.filter(option => option.selected);
      console.log('Étapes sélectionnées:', selectedEtapes); // Pour le débogage

      // Vérifier si des étapes ont été sélectionnées
      if (selectedEtapes.length > 0) {
        // Assurez-vous que this.activiteToAdd.etape est bien un tableau
        if (!Array.isArray(this.activiteToAdd.etape)) {
          this.activiteToAdd.etape = []; // Initialisez comme un tableau vide si nécessaire
        }

        // Filtrer les étapes qui n'ont pas encore été ajoutées à l'activité
        const nouvellesEtapes = selectedEtapes.filter(etape => {
          return !this.activiteToAdd.etape!.some(existingEtape => existingEtape.id === etape.id);
        });

        console.log('Nouvelles étapes à ajouter:', nouvellesEtapes); // Pour le débogage

        if (nouvellesEtapes.length > 0) {
          // Envoyer uniquement les nouvelles étapes sélectionnées
          this.etapeService.add(nouvellesEtapes).then(response => {
            console.log('Étapes ajoutées avec succès:', response);

            // Ajoutez les nouvelles étapes retournées par le backend à l'activité
            if (response && Array.isArray(response)) {
              this.activiteToAdd.etape!.push(...response); // Utilisez le spread operator pour ajouter les nouvelles étapes
            }

            // Après avoir ajouté les étapes, on peut procéder à l'ajout ou la modification de l'activité
            this.submitActivity();
          }).catch(error => {
            console.error('Erreur lors de l\'ajout des étapes:', error);
            this.snackBar.open("Erreur", "Erreur lors de l'ajout des étapes.", { duration: 3000 });
          });
        } else {
          // Si aucune nouvelle étape à ajouter
          this.snackBar.open("Info", "Toutes les étapes sélectionnées sont déjà ajoutées.", { duration: 3000 });
          this.submitActivity(); // On peut toujours soumettre l'activité sans modification d'étape
        }
      } else {
        console.warn('Aucune étape sélectionnée.');
        // Lors de la modification, vous pouvez choisir d'ajouter une étape vide ou permettre la soumission
        if (this.activiteToAdd.etape!.length === 0) {
          this.snackBar.open("Info", "Aucune étape sélectionnée. Vous pouvez toujours modifier l'activité sans étapes.", { duration: 3000 });
        }
        this.submitActivity(); // Soumettez même sans étapes
      }
    } else {
      // Si en mode d'ajout, on peut soumettre directement l'activité
      this.submitActivity();
    }
  }

  submitActivity() {
    // Vérifiez que this.activiteToAdd.etape existe et est un tableau
    if (this.isModificationMode && (!this.activiteToAdd.etape || this.activiteToAdd.etape.length === 0)) {
      this.snackBar.open("Erreur", "Veuillez sélectionner au moins une étape pour la modification.", { duration: 3000 });
      return;
    }

    // Gestion de l'ajout ou de la mise à jour d'une activité
    if (this.isEditMode) {
      this.globalService.update("activite", this.activiteToAdd.id!, this.activiteToAdd).subscribe({
        next: (data: any) => {
          console.log(data);
          this.getAllActivite();
          this.snackBar.open("Succès", "Activité modifiée avec succès.", { duration: 3000 });
          this.resetForm();
        },
        error: (err: { error: { message: any; }; }) => {
          console.error(err);
          this.snackBar.open("Erreur", "Erreur lors de la modification de l'activité : " + (err.error?.message || 'Erreur inconnue'), { duration: 3000 });
        }
      });
    } else {
      this.globalService.post("activite", this.activiteToAdd).subscribe({
        next: (data: any) => {
          console.log(data);
          this.getAllActivite();
          this.snackBar.open("Succès", "Activité ajoutée avec succès.", { duration: 3000 });
          this.resetForm();
        },
        error: (err: { error: { message: any; }; }) => {
          console.error(err);
          this.snackBar.open("Erreur", "Erreur lors de l'ajout de l'activité : " + (err.error?.message || 'Erreur inconnue'), { duration: 3000 });
        }
      });
    }
  }


  /*submitActivity() {
    // Vérifiez que this.activiteToAdd.etape existe et est un tableau
    if (!this.activiteToAdd.etape || this.activiteToAdd.etape.length === 0) {
      this.snackBar.open("Erreur", "Veuillez sélectionner au moins une étape.", { duration: 3000 });
      return;
    }

    // Gestion de l'ajout ou de la mise à jour d'une activité
    if (this.isEditMode) {
      this.globalService.update("activite", this.activiteToAdd.id!, this.activiteToAdd).subscribe({
        next: (data: any) => {
          console.log(data);
          this.getAllActivite();
          this.snackBar.open("Succès", "Activité modifiée avec succès.", { duration: 3000 });
          this.resetForm();
        },
        error: (err: { error: { message: any; }; }) => {
          console.error(err);
          this.snackBar.open("Erreur", "Erreur lors de la modification de l'activité : " + (err.error?.message || 'Erreur inconnue'), { duration: 3000 });
        }
      });
    } else {
      this.globalService.post("activite", this.activiteToAdd).subscribe({
        next: (data: any) => {
          console.log(data);
          this.getAllActivite();
          this.snackBar.open("Succès", "Activité ajoutée avec succès.", { duration: 3000 });
          this.resetForm();
        },
        error: (err: { error: { message: any; }; }) => {
          console.error(err);
          this.snackBar.open("Erreur", "Erreur lors de l'ajout de l'activité : " + (err.error?.message || 'Erreur inconnue'), { duration: 3000 });
        }
      });
    }
  }*/


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
