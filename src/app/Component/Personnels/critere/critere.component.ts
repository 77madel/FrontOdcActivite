import {ChangeDetectorRef, Component} from '@angular/core';
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
import {MatSelect} from "@angular/material/select";
import {CritereService, Critere} from "../../../core";

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
    MatSelect,
    MatOption
  ],
  templateUrl: './critere.component.html',
  styleUrl: './critere.component.scss'
})
export class CritereComponent {

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

  constructor(
    private fb: FormBuilder,
    private readonly critereService: CritereService,
    private readonly router: Router,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {
    this.addElementForm = this.fb.group({
      libelle: ['', Validators.required],
      intutile: ['', Validators.required],
      point: ['', Validators.required],
    });
  }

  // Fonction pour basculer l'affichage du formulaire et de la table
  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.isTableVisible = !this.isTableVisible; // Basculer la visibilité de la table
  }

  async handleSubmit() {
    if (!this.formData.libelle || !this.formData.intutile || !this.formData.point) {
      this.showError('Veuillez remplir tous les champs.');
      return;
    }

    const confirmAction = confirm(this.isEditMode ? 'Êtes-vous sûr de vouloir modifier cet élément ?' : 'Êtes-vous sûr de vouloir enregistrer ?');
    if (!confirmAction) {
      return;
    }

    try {
      let response: any;

      if (this.isEditMode && this.currentRoleId) {
        // Modifier le critère existant
        response = await this.critereService.update(this.currentRoleId, this.formData);
        this.snackBar.open("Modification réussie", "Fermer", { duration: 3000 });
        this.critere = this.critere.map(critere => critere.id === this.currentRoleId ? response : critere);
      } else {
        // Ajouter un nouveau critère
        response = await this.critereService.add(this.formData);
        this.snackBar.open("Ajout réussi", "Fermer", { duration: 3000 });
        this.critere.push(response);
      }

      // Réinitialiser le formulaire après ajout/modification
      this.addElementForm.reset();
      this.formData = {}; // Réinitialiser l'objet formData
      this.isEditMode = false; // Revenir en mode ajout
      this.isFormVisible = false;
      this.isTableVisible = true;

    } catch (error) {
      this.showError('Erreur lors de la soumission du formulaire.');
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
    const confirmDeletion = confirm('Êtes-vous sûr de vouloir supprimer ?');
    if (!confirmDeletion) {
      return;
    }

    try {
      const response = await this.critereService.delete(id);
      this.critere = response;
      this.fetchElements();
      this.snackBar.open("Succes", "supprimer", {duration: 3000});


    } catch (error) {
      this.showError('Erreur lors de la suppression ');
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
