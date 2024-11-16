import { Component, OnInit } from '@angular/core';
import { Utilisateur, GlobalCrudService, Role, RoleServiceService, Entite, EntiteOdcService } from '../../../../../core';
import { MatSnackBar } from "@angular/material/snack-bar";
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employer',
  standalone: true,
  templateUrl: './employer.component.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./employer.component.scss']
})
export class EmployerComponent implements OnInit {

  utilisateurList: Utilisateur[] = [];
  utilisateurToAdd = new Utilisateur();
  selectedUtilisateur!: Utilisateur;
  role: Role[] = [];
  entite: Entite[] = [];

  isFormVisible: boolean = false;
  isTableVisible: boolean = true;
  isEditMode: boolean = false;

  searchTerm: string = '';
  genre: string[] = ['Homme', 'Femme'];

  itemsPerPage: number = 12;
  currentPage: number = 1;

  constructor(
    private globalService: GlobalCrudService,
    private roleService: RoleServiceService,
    private entiteService: EntiteOdcService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllUtilisateur();
    this.getRole();
    this.getEntite();
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    this.isTableVisible = !this.isTableVisible;
    if (!this.isFormVisible) {
      this.resetForm();
    }
  }

  get filteredUtilisateur() {
    if (!this.utilisateurList.length) return [];
    if (!this.searchTerm) return this.utilisateurList;
    return this.utilisateurList.filter(element =>
      element.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.prenom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.phone?.includes(this.searchTerm)
    );
  }

  get paginatedUtilisateur() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUtilisateur.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredUtilisateur.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  private getAllUtilisateur() {
    this.globalService.get("utilisateur").subscribe({
      next: (utilisateurs) => this.utilisateurList = utilisateurs,
      error: (error) => console.error("Erreur lors de la récupération des utilisateurs:", error)
    });
  }

  private async getRole() {
    try {
      this.role = await this.roleService.getAllRole();
    } catch (error) {
      this.snackBar.open("Erreur", "Une erreur est survenue lors de la récupération des rôles.", { duration: 3000 });
    }
  }

  private getEntite() {
    this.globalService.get("entite").subscribe({
      next: (entites) => this.entite = entites,
      error: (error) => console.error("Erreur lors de la récupération des entités:", error)
    });
  }

  ajouterUtilisateur() {
    if (!this.utilisateurToAdd.role) {
      Swal.fire({
        icon: 'info',
        title: '<span class="text-orange-500">Info</span>',
        text: 'Veuillez sélectionner un rôle.',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'bg-red-500 text-white hover:bg-red-600',
        },
      });
      return;
    }

    const action = this.isEditMode
      ? this.globalService.update("utilisateur", this.utilisateurToAdd.id!, this.utilisateurToAdd)
      : this.globalService.post("utilisateur", this.utilisateurToAdd);

    action.subscribe({
      next: () => {
        this.getAllUtilisateur();
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
          title: `${this.isEditMode ? "Modification opéré" : "Adjonction réalisée"} avec succès.`
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

  modifierUtilisateur(utilisateur: Utilisateur) {
    this.isEditMode = true;
    this.utilisateurToAdd = { ...utilisateur };
    this.toggleForm();
  }

  supprimerUtilisateur(utilisateur: Utilisateur) {
    this.globalService.delete("utilisateur", utilisateur.id!).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Eradication diligente pleinement consommée.',
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true
        });
        this.getAllUtilisateur();
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

  protected resetForm() {
    this.isEditMode = false;
    this.utilisateurToAdd = new Utilisateur();
    this.isFormVisible = false;
    this.isTableVisible = true;
  }
}
