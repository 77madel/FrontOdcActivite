import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {Utilisateur, BlackList, GlobalCrudService} from "../../../core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-black-list',
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
    ReactiveFormsModule
  ],
  templateUrl: './black-list.component.html',
  styleUrl: './black-list.component.scss'
})
export class BlackListComponent {
  blackList!: BlackList[];
  selectedBlackList!: BlackList;
  blackListToAdd!: BlackList;

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

  get filteredBlackList() {
    if (!this.blackList || this.blackList.length === 0) {
      return []; // Retourner un tableau vide si utilisateurList n'est pas défini ou vide
    }
    if (!this.searchTerm) {
      return this.blackList;
    }
    return this.blackList.filter(element =>
      element.nom!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.prenom!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.email!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.phone!.includes(this.searchTerm) // Ajoutez d'autres propriétés si nécessaire
    );
  }

  get paginatedBlackList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBlackList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredBlackList.length / this.itemsPerPage) || 0; // Retourner 0 si la longueur est 0
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
    this.blackListToAdd = new Utilisateur();
  }

  ngOnInit(): void {
    this.getAllBlacklist();
  }

  getAllBlacklist(){
    this.globalService.get("blacklist").subscribe({
      next: value => {
        this.blackList = value
      },
      error: err => {
        console.log(err);
      }
    })
  }

  // Méthode pour afficher le formulaire pour ajouter un nouvel utilisateur ou modifier un utilisateur existant
  modifierBlacklist(blacklist: BlackList) {
    this.isEditMode = true; // Activer le mode édition
    this.blackListToAdd = { ...blacklist }; // Remplir le formulaire avec les données de l'utilisateur sélectionné
    this.toggleForm(); // Afficher le formulaire
  }


  ajouterBlacklist() {

    if (this.isEditMode) {
      // Mode édition
      this.globalService.update("blacklist", this.blackListToAdd.id!, this.blackListToAdd).subscribe({
        next: (data) => {
          console.log(data);
          this.getAllBlacklist();
          this.snackBar.open("Succès", "modifié avec succès.", { duration: 3000 });
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open("Erreur", "Erreur lors de la modification : " + (err.error?.message || 'Erreur inconnue'), { duration: 3000 });
        }
      });
    } else {
      // Mode ajout
      this.globalService.post("blacklist", this.blackListToAdd).subscribe({
        next: (data) => {
          console.log(data);
          this.getAllBlacklist();
          this.snackBar.open("Succès", "ajouté avec succès.", { duration: 3000 });
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open("Erreur", "Erreur lors de l'ajout : " + (err.error?.message || 'Erreur inconnue'), { duration: 3000 });
        }
      });
    }
  }

  // Réinitialiser le formulaire après ajout ou modification
  resetForm() {
    this.isEditMode = false; // Désactiver le mode édition
    this.blackListToAdd = new BlackList(); // Réinitialiser à une nouvelle instance
    this.isFormVisible = false; // Cacher le formulaire
    this.isTableVisible = true; // Afficher la table
  }

  supprimerBlacklist(selectedBlackList: BlackList ) {
    this.globalService.delete("blacklist", selectedBlackList.id!).subscribe(
      {
        next: () => {
          this.snackBar.open("Succès","Suppresion effectue avec success.", {duration: 3000});
          this.getAllBlacklist();
        },
        error: (err) => {
          console.log(err);
          this.snackBar.open("Erreur","Erreur lors de la suppression.", {duration: 3000});
        }
      }
    )
  }


}
