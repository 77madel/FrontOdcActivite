import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Utilisateur, BlackList, GlobalCrudService, LoginServiceService} from "../../../core";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-black-list',
    imports: [
        FormsModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
    templateUrl: './black-list.component.html',
    styleUrl: './black-list.component.scss'
})
export class BlackListComponent implements OnInit {
  blackList!: BlackList[];
  selectedBlackList!: BlackList;
  blackListToAdd!: BlackList;

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
    private snackBar: MatSnackBar,
    private loginService: LoginServiceService
  )
  {
    this.userRoles = this.loginService.getUserRoles();
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
      // Mode ajout
      this.globalService.post("blacklist", this.blackListToAdd).subscribe({
        next: (data) => {
          console.log(data);
          this.getAllBlacklist();
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
    this.blackListToAdd = new BlackList(); // Réinitialiser à une nouvelle instance
    this.isFormVisible = false; // Cacher le formulaire
    this.isTableVisible = true; // Afficher la table
  }

  supprimerBlacklist(selectedBlackList: BlackList ) {
    this.globalService.delete("blacklist", selectedBlackList.id!).subscribe(
      {
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
            title: "Suppresion opérée avec éclat."
          });
          this.getAllBlacklist();
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
