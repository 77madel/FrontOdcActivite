import {Component, OnInit} from '@angular/core';
import {TypeActivite, GlobalCrudService, LoginServiceService} from "../../../core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-type-acticite',
    imports: [
        FormsModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
    templateUrl: './type-acticite.component.html',
    styleUrl: './type-acticite.component.scss'
})
export class TypeActiciteComponent implements OnInit {
  typeActiviteList!: TypeActivite[];
  selectedtypeActivite!: TypeActivite;
  typeActiviteToAdd!: TypeActivite;

  isFormVisible: boolean = false;
  isTableVisible: boolean = true;
  isEditMode = false;
  userRoles: string[] = [];

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.isTableVisible = !this.isTableVisible; // Basculer la visibilité de la table

    // Réinitialiser isEditMode à false lorsque le formulaire est fermé
    if (!this.isFormVisible) {
      this.isEditMode = false;
      this.resetForm();
    }
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
    private snackBar: MatSnackBar,
    private loginService: LoginServiceService
  ) {
    this.userRoles = this.loginService.getUserRoles();
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
    console.log("Appel de ajouterTypeActivite avec", this.typeActiviteToAdd);
    if (this.isEditMode) {
      console.log("Mode édition activé");
      this.globalService.update("typeActivite", this.typeActiviteToAdd.id!, this.typeActiviteToAdd).subscribe({
        next: (data: any) => {
          this.getAllType();
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
    } else {
      console.log("Mode ajout activé");
      this.globalService.post("typeActivite", this.typeActiviteToAdd).subscribe({
        next: (data: any) => {
          console.log("Réponse de l'ajout", data);
          this.getAllType();
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
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Eradication diligente pleinement consommée.',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true
          });
          this.getAllType();
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
      }
    )
  }

}
