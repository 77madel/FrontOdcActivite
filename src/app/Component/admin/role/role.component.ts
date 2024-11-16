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
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'info',
        title: '<span class="text-orange-500">Info</span>',
        text: 'Veuillez remplir tous les champs.',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'bg-red-500 text-white hover:bg-red-600',
        },
      });
      return;
    }

    // Confirmation avant l'enregistrement
    Swal.fire({
      title: this.isEditMode ? 'Modification de l\'élément' : 'Enregistrement de l\'élément',
      text: this.isEditMode
        ? 'Êtes-vous sûr de vouloir modifier cet élément ?'
        : 'Êtes-vous sûr de vouloir enregistrer cet élément ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // L'utilisateur a confirmé l'action
        // Ajoutez ici votre logique
      } else {
        // L'utilisateur a annulé l'action
        return;
      }
    });

    try {
      let response: any;

      if (this.isEditMode && this.currentRoleId) {
        // Si en mode édition, on modifie le rôle existant
        response = await this.roleServive.updateRole(this.currentRoleId, this.formData);
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

        // Mise à jour du tableau local après modification
        this.role = this.role.map(role => role.id === this.currentRoleId ? response : role);

      } else {
        // Sinon, on ajoute un nouveau rôle
        response = await this.roleServive.role(this.formData);
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
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Eradication diligente pleinement consommée.',
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true
      });


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
