import { Component, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInput } from "@angular/material/input";
import { MatCardModule } from '@angular/material/card';
import { Router } from "@angular/router";
import { Role, RoleServiceService } from '../../../core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    MatCardModule,
  ],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'actions'];
  dataSource: { data: Role[] } = { data: [] }; // Initialiser dataSource avec une liste vide

  formData: any = {
    nom: ''
  };
  role:Role[]=[];


  errorMessage: string = '';

  isFormVisible: boolean = false;
  isTableVisible: boolean = true; // Contrôle la visibilité de la table
  addElementForm: FormGroup;
  isEditMode = false;
  currentRoleId: number | null = null;



  constructor(
    private fb: FormBuilder,
    private readonly roleServive: RoleServiceService,
    private readonly router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.addElementForm = this.fb.group({
      nom: ['', Validators.required],
    });
  }

  // Fonction pour basculer l'affichage du formulaire et de la table
  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.isTableVisible = !this.isTableVisible; // Basculer la visibilité de la table
  }

  async handleSubmit() {
    // Vérifier si le champ "nom" est vide
    if (!this.formData.nom) {
      this.showError('Veuillez remplir tous les champs.');
      return;
    }

    // Confirmation avant l'enregistrement
    const confirmRegistration = confirm(this.isEditMode ? 'Êtes-vous sûr de vouloir modifier cet élément ?' : 'Êtes-vous sûr de vouloir enregistrer cet utilisateur ?');
    if (!confirmRegistration) {
      return;
    }

    try {
      let response: any;

      if (this.isEditMode && this.currentRoleId) {
        // Si en mode édition, on modifie le rôle existant
        response = await this.roleServive.updateRole(this.currentRoleId, this.formData);
        this.snackBar.open("Succes", "Role Modifier", {duration: 3000} );

        // Mise à jour du tableau local après modification
        this.role = this.role.map(role => role.id === this.currentRoleId ? response : role);

      } else {
        // Sinon, on ajoute un nouveau rôle
        response = await this.roleServive.role(this.formData);
        this.snackBar.open("Succes", "Role ajouter avec succes", {duration: 3000});
        // Ajouter le nouveau rôle au tableau local
        this.role.push(response);
      }

      // Réinitialiser le formulaire après l'ajout ou la modification
      this.addElementForm.reset();
      this.isFormVisible = false; // Fermer le formulaire
      this.isTableVisible = true; // Afficher le tableau

    } catch (error: any) {
      this.showError(error.message);
    }
  }

  onEditRole(role: any): void {
    this.isEditMode = true;
    this.currentRoleId = role.id; // Stocker l'ID du rôle en cours de modification
    this.formData = { ...role }; // Préremplir le formulaire avec les données existantes
    this.isFormVisible = true; // Afficher le formulaire
    this.isTableVisible = false; // Masquer le tableau
  }


  async fetchElements(): Promise<void> {
    try {
      const response = await this.roleServive.getAllRole();
      this.role = response;


    } catch (error) {
      this.showError('Une erreur est survenue lors de la récupération des rôles.');
    }
  }


  async onDeleteRole(roleId: number | undefined): Promise<void> {
    const confirmDeletion = confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?');
    if (!confirmDeletion) {
      return;
    }

    try {
      const response = await this.roleServive.deleteRole(roleId);
        this.role = response;
      // if (!response) {
      //   this.showError('Aucune réponse du serveur');
      //   return;
      // }
      this.snackBar.open("Succes", "Role supprimer", {duration: 3000});


    } catch (error) {
      this.showError('Erreur lors de la suppression du rôle');
    }
  }



  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = ''; // Effacer le message d'erreur après un délai
    }, 3000);
  }




  ngOnInit(): void {
    this.fetchElements(); // Appel de la méthode pour récupérer les données au démarrage
  }
}
