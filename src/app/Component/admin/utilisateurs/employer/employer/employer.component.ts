import { Component, OnInit } from '@angular/core';
import { Utilisateur, GlobalCrudService, Role, RoleServiceService, Entite, EntiteOdcService } from '../../../../../core';
import { MatSnackBar } from "@angular/material/snack-bar";
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

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

  itemsPerPage: number = 5;
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
      this.snackBar.open("Erreur", "Veuillez sélectionner un rôle.", { duration: 3000 });
      return;
    }

    const action = this.isEditMode
      ? this.globalService.update("utilisateur", this.utilisateurToAdd.id!, this.utilisateurToAdd)
      : this.globalService.post("utilisateur", this.utilisateurToAdd);

    action.subscribe({
      next: () => {
        this.getAllUtilisateur();
        this.snackBar.open("Succès", `Utilisateur ${this.isEditMode ? "modifié" : "ajouté"} avec succès.`, { duration: 3000 });
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open("Erreur", `Erreur lors de ${this.isEditMode ? "la modification" : "l'ajout"} de l'utilisateur : ${err.error?.message || 'Erreur inconnue'}`, { duration: 3000 });
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
        this.snackBar.open("Succès", "Suppression effectuée avec succès.", { duration: 3000 });
        this.getAllUtilisateur();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open("Erreur", "Erreur lors de la suppression de l'utilisateur.", { duration: 3000 });
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
