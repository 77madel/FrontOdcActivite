import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import { Entite, EntiteOdcService, Utilisateur, Role, GlobalCrudService, RoleServiceService } from '../../../core';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entite-odc',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule,
  ],
  templateUrl: './entite-odc.component.html',
  styleUrl: './entite-odc.component.css'
})
export class EntiteODCComponent implements OnInit {
  entiteList!: Entite[];
  selectedEntite!: Entite;
  entiteToAdd!: Entite;
  selectedFile: File | null = null;
  activiteCount: { [key: number]: number } = {}
  utilisateur: Utilisateur[] = [];
  selectedUtilisateur: Utilisateur | null = null; // Déclaration de la variable pour stocker l'utilisateur sélectionné
  currentYear: number = new Date().getFullYear();
  utilisateursPersonnels: any[] = [];

  isFormVisible: boolean = false;
  isTableVisible: boolean = true;
  isEditMode = false;

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.isTableVisible = !this.isTableVisible; // Basculer la visibilité de la table

    // Réinitialiser isEditMode à false lorsque le formulaire est fermé
    if (!this.isFormVisible) {
      this.isEditMode = false;
    }
  }

  searchTerm: string = '';

  itemsPerPage = 5; // Nombre d'éléments par page
  currentPage = 1; // Page actuelle

  get filteredEntite() {
    if (!this.entiteList || this.entiteList.length === 0) {
      return []; // Retourner un tableau vide si utilisateurList n'est pas défini ou vide
    }
    if (!this.searchTerm) {
      return this.entiteList;
    }
    return this.entiteList.filter(element =>
      element.nom!.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedEntite() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEntite.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredEntite.length / this.itemsPerPage) || 0; // Retourner 0 si la longueur est 0
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
    private entiteService: EntiteOdcService,
    private snackBar: MatSnackBar,
    private router: Router) {
    this.entiteToAdd = new Entite();

  }

  viewEntiteDetails(entite: any): void {
    this.router.navigate(['/entite-detail', entite.id]);
  }

  ngOnInit(): void {
    this.getAllEntite();
    this.getAllUtilisateur();
  }

  getAllEntite(): void {
    this.globalService.get("entite").subscribe({
      next: (value) => {
        this.entiteList = value; // Récupérer la liste des entités

        this.entiteList.forEach(entite => {
          if (entite?.id !== undefined) { // Vérification que l'ID n'est pas indéfini et que l'entité est bien définie
            this.getNombreActivites(entite.id); // Appel pour récupérer le nombre d'activités
          }
        });
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des entités : ", err);
        if (err.status === 403) {
          console.log("Accès refusé. Veuillez vérifier vos permissions.");
        }
      }
    });
  }

  getAllUtilisateur() {
    this.globalService.get("utilisateur").subscribe({
      next: (value) => {
        this.utilisateur = value;
        console.log("Réponse brute de l'API :",  this.utilisateur );
        // Vérifiez que la réponse est un tableau
        if (Array.isArray(value)) {
          // Filtrer les utilisateurs ayant le rôle "Personnel"
          this.utilisateursPersonnels = value.filter(user => user.role.nom === 'PERSONNEL');
          console.log("Utilisateurs avec le rôle 'Personnel':", this.utilisateursPersonnels);
        } else {
          console.error("La réponse n'est pas un tableau :", value);
        }
      },
      error: (err: any) => {
        console.error("Erreur lors de la récupération des utilisateurs :", err);
      }
    });
  }






  getNombreActivites(entiteId: number): void {
    this.entiteService.getNombreActivites(entiteId).subscribe(count => {
      this.activiteCount[entiteId] = count; // Stocker le nombre d'activités dans le dictionnaire
    });
  }


  // Méthode pour afficher le formulaire pour ajouter un nouvel utilisateur ou modifier un utilisateur existant
  modifierEntite(entite: Entite) {
    this.isEditMode = true; // Activer le mode édition
    this.entiteToAdd = { ...entite }; // Remplir le formulaire avec les données de l'utilisateur sélectionné
    this.toggleForm(); // Afficher le formulaire
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  ajouterEntite() {
    const formData = new FormData();

    // Ajoutez les propriétés de l'entité
    formData.append('entiteOdc', new Blob([JSON.stringify(this.entiteToAdd)], { type: 'application/json' }));

    // Ajoutez le fichier (si disponible)
    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }

    // Vérifiez que l'utilisateur sélectionné est disponible et ajoutez son ID
    if (this.selectedUtilisateur && this.selectedUtilisateur.id) {

      formData.append('utilisateurId', this.selectedUtilisateur.id.toString()); // Utilisez l'ID de l'utilisateur
    } else {
      Swal.fire({
        icon: 'info',
        title: '<span class="text-orange-500">Info</span>',
        text: 'Aucun utilisateur sélectionné ou ID non disponible.',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'bg-red-500 text-white hover:bg-red-600',
        },
      });
      // Gérez l'erreur ou faites une action appropriée
      return; // Arrêtez l'exécution si aucun utilisateur n'est sélectionné
    }

    if (this.isEditMode) {
      // Mode édition
      this.globalService.update("entite", this.entiteToAdd.id!, formData).subscribe({
        next: (data) => {
          console.log(data);
          this.getAllEntite();
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
        error: (err) => {
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
      // Mode ajout
      this.globalService.post("entite", formData).subscribe({
        next: (data) => {
          console.log(data);
          this.getAllEntite();
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
        error: (err) => {
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


  // Réinitialiser le formulaire après ajout ou modification
  resetForm() {
    this.isEditMode = false; // Désactiver le mode édition
    this.entiteToAdd = new Entite(); // Réinitialiser à une nouvelle instance
    this.isFormVisible = false; // Cacher le formulaire
    this.isTableVisible = true; // Afficher la table
  }

  supprimerEntite(selectedEntite: Entite ) {
    this.globalService.delete("utilisateur", selectedEntite.id!).subscribe(
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
          this.getAllEntite();
        },
        error: (err) => {
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
      }
    )
  }

}
