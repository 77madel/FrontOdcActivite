import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  Etape,
  EtapeService,
  Critere,
  CritereService,
  Activity,
  GlobalCrudService,
  LoginServiceService
} from '../../../core';
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import {ListeFiltreComponent} from './liste-global/liste-filtre.component';
import {MatDialog} from '@angular/material/dialog';

interface EtapeDTO {
  id: number;
  nom: string;
  statut: string;
  listeDebut: [];
  listeResultat: [];
}

@Component({
  selector: 'app-etape',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    ListeFiltreComponent
  ],
  templateUrl: './etape.component.html',
  styleUrls: ['./etape.component.scss']
})
export class EtapeComponent implements OnInit {

  addElementForm: FormGroup;
  errorMessage: string = '';
  isFormVisible: boolean = false;
  isTableVisible: boolean = true;
  isEditMode = false;
  currentEtapeId: number | undefined;
  currentEtapeNom: string | null = null;


  etapes: Etape[] = [];
  criteres: Critere[] = [];
  dateDebut?: Date;
  dateFin?: Date;
  selectedCriteres: number[] = [];
  userRoles: string[] = [];

  visibleLists: { [key: number]: boolean } = {};

  // toggleListVisibility(id: number | undefined): void {
  //   if (id !== undefined) {
  //     this.visibleLists[id] = !this.visibleLists[id];
  //   }
  // }

  itemsPerPage = 5;
  currentPage = 1;

  constructor(
    private fb: FormBuilder,
    private etapeService: EtapeService,
    private globalService: GlobalCrudService,
    private snackBar: MatSnackBar,
    private critereService: CritereService,
    private router: Router,
    private loginService: LoginServiceService,
    private dialog: MatDialog

  ) {
    this.addElementForm = this.fb.group({
      nom: ['', Validators.required],
      // statut: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      critere: this.fb.array([], Validators.required), // Tableau pour les critères
    });
    this.userRoles = this.loginService.getUserRoles();
  }

  get paginatedEtapes() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.etapes.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.etapes.length / this.itemsPerPage);
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

  ngOnInit(): void {
    this.fetchElements();
    this.fetchCriteres();
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const critereArray = this.addElementForm.get('critere') as FormArray;

    if (checkbox.checked) {
      critereArray.push(this.fb.control(checkbox.value));
    } else {
      const index = critereArray.controls.findIndex(control => control.value === checkbox.value);
      critereArray.removeAt(index);
    }
  }


  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.isTableVisible = !this.isTableVisible; // Basculer la visibilité de la table

    // Réinitialiser isEditMode à false lorsque le formulaire est fermé
    if (!this.isFormVisible) {
      this.isEditMode = false;
      this.resetForm() // Si vous utilisez un objet `formData`, réinitialisez-le également
    }
  }


  resetForm() {
    this.isEditMode = false;
    this.isFormVisible = false;
    this.isTableVisible = true;
  }

  async handleSubmit() {
    console.log("Formulaire soumis :", this.addElementForm.value);

    if (this.addElementForm.invalid) {
      Swal.fire({
        icon: 'info',
        title: '<span class="text-red-500">Échec</span>',
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
      const formData: Etape = this.addElementForm.value;
      console.log("Données du formulaire :", formData);

      let response: Etape | Etape[] | undefined;

      if (this.isEditMode && this.currentEtapeId) {
        console.log("Modification de l'étape avec ID :", this.currentEtapeId);
        response = await this.etapeService.update(this.currentEtapeId, formData);
        console.log("Réponse de mise à jour :", response);

        if (response && !Array.isArray(response)) {
          this.etapes = this.etapes.map(etape =>
            etape.id === this.currentEtapeId ? response as Etape : etape
          );
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
        } else {
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
      } else {
        // Ajout d'une nouvelle étape
        response = await this.etapeService.add([formData]);
        console.log("Réponse d'ajout :", response);
        if (Array.isArray(response)) {
          this.etapes.push(...response);
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
        } else {
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

      this.addElementForm.reset();
      this.isFormVisible = false;
      this.isTableVisible = true;
      this.isEditMode = false; // Réinitialiser le mode d'édition
      this.currentEtapeId = 0; // Réinitialiser l'ID après modification
    } catch (error: any) {
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


  selectedElement: any; // Créez une propriété pour stocker l'élément sélectionné

  onEdit(element: any) {
    this.isEditMode = true;
    this.selectedElement = element; // Stockez l'élément pour l'utiliser dans le formulaire
    this.addElementForm.patchValue({
      nom: element.nom,
      critere: element.critere,
      statut: element.statut
    });
    this.toggleForm(); // Affiche le formulaire
  }


  getAllNombre(name: string, id:number){
    this.globalService.getId("activite/get", this.currentEtapeId!).subscribe({
      next: value => {
        this.etapes = value
      },
      error: err => {
        console.log(err);
      }
    })
  }

  async fetchElements(): Promise<void> {
    try {
      const response = await this.etapeService.get();
      this.etapes = response;
    } catch (error) {
      this.showError('Une erreur est survenue lors de la récupération des données.');
    }
  }

  async fetchCriteres(): Promise<void> {
    try {
      const response = await this.critereService.get();
      this.criteres = response;
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
      await this.etapeService.delete(id);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Eradication diligente pleinement consommée.',
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true
      });
      this.fetchElements();
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


  // openUploadForm(etapeId: number | undefined, etapeNom: string | undefined) {
  //   if (etapeId && etapeNom) {
  //     this.router.navigate([`/import/${etapeId}/${etapeNom}`]);
  //   } else {
  //     console.error('ID ou nom de l\'étape manquant.');
  //   }
  // }

  openUploadForm(etapeId: number | undefined, etapeNom: string | undefined) {
    if (etapeId !== undefined && etapeNom !== undefined) {
      this.currentEtapeId = etapeId;
      this.currentEtapeNom = etapeNom;
      // this.isUploadFormVisible = true;
      // this.isFormVisible = false;
      // this.isTableVisible = false;

      // Chiffrement des données avant de les envoyer dans les queryParams
      const encryptedEtapeId = CryptoJS.AES.encrypt(etapeId.toString(), 'secretKey').toString();
      const encryptedEtapeNom = CryptoJS.AES.encrypt(etapeNom, 'secretKey').toString();

      // Envoi des paramètres dans l'URL sous forme de queryParams
      this.router.navigate(['/import'], { queryParams: { etapeId: encryptedEtapeId, etapeNom: encryptedEtapeNom } });

      console.log("Etape id actuel", this.currentEtapeId);
    } else {
      console.error('L\'ID ou le nom de l\'étape ne peut pas être indéfini.');
    }
  }






  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}













  /*// Gère le changement de fichier
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      console.log(`Fichier sélectionné : ${this.selectedFile.name}`);
    }
  }*/

/*// Méthode pour uploader des participants
  uploadParticipants(id: number, toListeDebut: boolean) {
    if (id === 0) {
      console.error('Erreur : ID de l\'étape est 0, impossible de continuer');
      this.errorMessage = 'ID de l\'étape invalide.';
      return;
    }

    // Vérifiez si un upload est déjà en cours
    if (this.uploading) {
      console.warn('Un upload est déjà en cours, veuillez attendre.');
      return;
    }

    if (this.selectedFile) {
      this.uploading = true; // Début de l'upload

      this.etapeService.uploadParticipants(id, this.selectedFile, toListeDebut).subscribe({
        next: () => {
          this.snackBar.open("Succès", "Participants ajoutés avec succès", { duration: 3000 });
          this.fetchElements(); // Met à jour la liste des étapes

          // Réinitialiser le fichier sélectionné
          this.selectedFile = null;

          // Masquer le formulaire d'upload et afficher la table
          this.isUploadFormVisible = false;
          this.isTableVisible = true; // Assurez-vous que cette variable est définie correctement

          this.uploading = false; // Fin de l'upload
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout des participants', err);
          this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout des participants. Veuillez réessayer.';
          this.uploading = false; // Fin de l'upload même en cas d'erreur
        }
      });
    } else {
      console.error('Aucun fichier sélectionné');
      this.errorMessage = 'Veuillez sélectionner un fichier avant de continuer.';
    }
  }*/


/*this.uploadForm = this.fb.group({
      step: [null, Validators.required] // Assurez-vous que cette propriété est correcte
    });*/



/*openUploadForm(etapeId: number | undefined, etapeNom: string | undefined) {
    if (etapeId !== undefined && etapeNom !== undefined) {
      this.currentEtapeId = etapeId;
      this.currentEtapeNom = etapeNom; // Assurez-vous d'assigner le nom de l'étape
      this.isUploadFormVisible = true; // Affiche le formulaire d'upload
      this.isFormVisible = false; // Masque le formulaire d'ajout
      this.  isTableVisible = false; // Masque le formulaire d'ajout
    } else {
      console.error('L\'ID ou le nom de l\'étape ne peut pas être indéfini.');
    }
  }*/

/*
get paginatedEtapes() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.etapes.slice(startIndex, startIndex + this.itemsPerPage);
}

get totalPages() {
  return Math.ceil(this.etapes.length / this.itemsPerPage);
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
}*/


/*// Gère le changement de fichier
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      console.log(`Fichier sélectionné : ${this.selectedFile.name}`);
    }
  }*/

/*// Méthode pour uploader des participants
  uploadParticipants(id: number, toListeDebut: boolean) {
    if (id === 0) {
      console.error('Erreur : ID de l\'étape est 0, impossible de continuer');
      this.errorMessage = 'ID de l\'étape invalide.';
      return;
    }

    // Vérifiez si un upload est déjà en cours
    if (this.uploading) {
      console.warn('Un upload est déjà en cours, veuillez attendre.');
      return;
    }

    if (this.selectedFile) {
      this.uploading = true; // Début de l'upload

      this.etapeService.uploadParticipants(id, this.selectedFile, toListeDebut).subscribe({
        next: () => {
          this.snackBar.open("Succès", "Participants ajoutés avec succès", { duration: 3000 });
          this.fetchElements(); // Met à jour la liste des étapes

          // Réinitialiser le fichier sélectionné
          this.selectedFile = null;

          // Masquer le formulaire d'upload et afficher la table
          this.isUploadFormVisible = false;
          this.isTableVisible = true; // Assurez-vous que cette variable est définie correctement

          this.uploading = false; // Fin de l'upload
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout des participants', err);
          this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout des participants. Veuillez réessayer.';
          this.uploading = false; // Fin de l'upload même en cas d'erreur
        }
      });
    } else {
      console.error('Aucun fichier sélectionné');
      this.errorMessage = 'Veuillez sélectionner un fichier avant de continuer.';
    }
  }*/
