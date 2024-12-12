import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonModule} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, MatOption} from "@angular/material/core";
import {CritereService, Critere, LoginServiceService} from "../../../core";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-critere',
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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './critere.component.html',
  styleUrl: './critere.component.scss'
})
export class CritereComponent implements OnInit {

  displayedColumns: string[] = ['libelle','intutile','point', 'actions'];

  formData: any = {
    libelle: '',
    intutile: '',
    point: '',
  };

  critere: Critere[] = [];

  itemsPerPage = 5; // Nombre d'éléments par page
  currentPage = 1; // Page actuelle

  get paginated() {
    if (!this.critere || this.critere.length === 0) {
      return [];
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.critere.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.critere.length / this.itemsPerPage);
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

  errorMessage: string = '';

  isFormVisible: boolean = false;
  isTableVisible: boolean = true; // Contrôle la visibilité de la table
  addElementForm: FormGroup;
  isEditMode = false;
  currentRoleId: number | null = null;
  userRoles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly critereService: CritereService,
    private readonly router: Router,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private loginService: LoginServiceService
  ) {
    this.addElementForm = this.fb.group({
      libelle: ['', Validators.required],
      intutile: ['', Validators.required],
      point: ['', Validators.required],
    });
    this.userRoles = this.loginService.getUserRoles();
  }

  // Fonction pour basculer l'affichage du formulaire et de la table
  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.isTableVisible = !this.isTableVisible; // Basculer la visibilité de la table

    // Réinitialiser isEditMode à false lorsque le formulaire est fermé
    if (!this.isFormVisible) {
      this.isEditMode = false;
      this.addElementForm.reset(); // Réinitialise tous les champs du formulaire
      this.formData = {}; // Si vous utilisez un objet `formData`, réinitialisez-le également
    }
  }

  async handleSubmit() {
    if (!this.formData.libelle || !this.formData.intutile || !this.formData.point) {
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
        // Modifier le critère existant
        response = await this.critereService.update(this.currentRoleId, this.formData);
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
        this.critere = this.critere.map(critere => critere.id === this.currentRoleId ? response : critere);
      } else {
        // Ajouter un nouveau critère
        response = await this.critereService.add(this.formData);
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
        this.critere.push(response);
      }

      // Réinitialiser le formulaire après ajout/modification
      this.addElementForm.reset();
      this.formData = {}; // Réinitialiser l'objet formData
      this.isEditMode = false; // Revenir en mode ajout
      this.isFormVisible = false;
      this.isTableVisible = true;

    } catch (error) {
      await Swal.fire({
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

  onEdit(critere: Critere): void {
    this.isEditMode = true;
    this.currentRoleId = critere.id !== undefined ? critere.id : null; // Utiliser null si id est undefined
    this.formData = {
      libelle: critere.libelle || '', // Assigner une valeur par défaut si `null`
      intutile: critere.intutile || '',
      point: critere.point || ''
    };
    this.isFormVisible = true; // Afficher le formulaire
    this.isTableVisible = false; // Masquer le tableau
  }

  async fetchElements(): Promise<void> {
    try {
      const response = await this.critereService.get();
      this.critere = response || []; // Si response est null, critere sera un tableau vide
    } catch (error) {
      this.showError('Une erreur est survenue lors de la récupération des critères.');
    }
  }

  async onDelete(id: number | undefined): Promise<void> {
    Swal.fire({
      title: 'Suppression de l\'élément',
      text: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
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
      const response = await this.critereService.delete(id);
      this.critere = response;
      this.fetchElements();
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Eradication diligente pleinement consommée.',
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true
      });
    } catch (error) {
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
