import {Component} from '@angular/core';
import {TypeActivite, GlobalCrudService} from "../../../core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-type-acticite',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './type-acticite.component.html',
  styleUrl: './type-acticite.component.scss'
})
export class TypeActiciteComponent {
  typeActiviteList!: TypeActivite[];
  selectedtypeActivite!: TypeActivite;
  typeActiviteToAdd!: TypeActivite;

  isFormVisible: boolean = false;
  isTableVisible: boolean = true;
  isEditMode = false;

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.isTableVisible = !this.isTableVisible; // Basculer la visibilité de la table
  }


  searchTerm: string = '';

  itemsPerPage = 5; // Nombre d'éléments par page
  currentPage = 1; // Page actuelle

  get filteredTypeActivite() {
    if (!this.typeActiviteList || this.typeActiviteList.length === 0) {
      return []; // Retourner un tableau vide si utilisateurList n'est pas défini ou vide
    }
    if (!this.searchTerm) {
      return this.typeActiviteList;
    }
    return this.typeActiviteList.filter(element =>
      element.type!.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedTypeActivite() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTypeActivite.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredTypeActivite.length / this.itemsPerPage) || 0; // Retourner 0 si la longueur est 0
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
    private snackBar: MatSnackBar,) {
    this.typeActiviteToAdd = new TypeActivite();
  }

  ngOnInit(): void {
    this.getAllType();
  }

  getAllType(){
    this.globalService.get("typeActivite").subscribe({
      next: (value) => {
        this.typeActiviteList = value
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  // Méthode pour afficher le formulaire pour ajouter un nouvel utilisateur ou modifier un utilisateur existant
  modifierTypeActivite(typeActivite: TypeActivite) {
    this.isEditMode = true; // Activer le mode édition
    this.typeActiviteToAdd = { ...typeActivite }; // Remplir le formulaire avec les données de l'utilisateur sélectionné
    this.toggleForm(); // Afficher le formulaire
  }


  ajouterTypeActivite() {
    if (this.isEditMode) {
      // Mode édition
      this.globalService.update("typeActivite", this.typeActiviteToAdd.id!, this.typeActiviteToAdd).subscribe({
        next: (data: any) => {
          this.getAllType();
          this.snackBar.open("Succès", "Modifier avec succès.", { duration: 3000 });
          this.resetForm();
        },
        error: (err: { error: { message: any; }; }) => {
          console.error(err);
          this.snackBar.open("Erreur", "Erreur lors de la modification  : " + (err.error?.message || 'Erreur inconnue'), { duration: 3000 });
        }
      });
    } else {
      // Mode ajout
      this.globalService.post("typeActivite", this.typeActiviteToAdd).subscribe({
        next: (data: any) => {
          console.log(data);
          this.getAllType();
          this.snackBar.open("Succès", "ajouté avec succès.", { duration: 3000 });
          this.resetForm();
        },
        error: (err: { error: { message: any; }; }) => {
          console.error(err);
          this.snackBar.open("Erreur", "Erreur lors de l'ajout  : " + (err.error?.message || 'Erreur inconnue'), { duration: 3000 });
        }
      });
    }
  }
  // Réinitialiser le formulaire après ajout ou modification
  resetForm() {
    this.isEditMode = false; // Désactiver le mode édition
    this.typeActiviteToAdd = new TypeActivite(); // Réinitialiser à une nouvelle instance
    this.isFormVisible = false; // Cacher le formulaire
    this.isTableVisible = true; // Afficher la table
  }


  supprimerTypeActivite(selectedtypeActivite: TypeActivite ) {
    this.globalService.delete("typeActivite", selectedtypeActivite.id!).subscribe(
      {
        next: () => {
          this.snackBar.open("Succès","Suppresion effectue avec success.", {duration: 3000});
          this.getAllType();
        },
        error: (err: any) => {
          console.log(err);
          this.snackBar.open("Erreur","Erreur lors de la suppression.", {duration: 3000});
        }
      }
    )
  }

}
