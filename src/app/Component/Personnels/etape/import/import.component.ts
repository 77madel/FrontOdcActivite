import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {Etape, EtapeService, GlobalCrudService} from '../../../../core';
import {MatSnackBar} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-import',
  standalone: true,
    imports: [
      FormsModule,
      NgIf,
      ReactiveFormsModule,
      CommonModule,
    ],
  templateUrl: './import.component.html',
  styleUrl: './import.component.css'
})
export class ImportComponent implements OnInit{

  selectedFile: File[] = [];
  uploadForm: FormGroup | undefined;
  addElementForm: FormGroup;
  errorMessage: string = '';
  isUploadFormVisible: boolean = false;
  isFormVisible: boolean = false;
  isTableVisible: boolean = true;
  isEditMode = false;
  currentEtapeId: number | undefined;
  currentEtapeNom: string | undefined;
  uploading: boolean = false;


  etapes: Etape[] = [];

  goBackToEtape(): void {
    // Vous pouvez naviguer vers la page etape avec son ID et Nom
    this.router.navigate(['/etape']);  // Ajustez le chemin selon vos besoins
  }

  constructor(
    private fb: FormBuilder,
    private etapeService: EtapeService,
    private globalService: GlobalCrudService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.addElementForm = this.fb.group({
      nom: ['', Validators.required],
      // statut: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      critere: this.fb.array([], Validators.required), // Tableau pour les critères
    });
  }


  async fetchElements(): Promise<void> {
    try {
      const response = await this.etapeService.get();
      this.etapes = response;
      console.log("Etpae dnas import", this.etapes)
    } catch (error) {
      this.showError('Une erreur est survenue lors de la récupération des données.');
    }
  }


  // onFileChange(event: any) {
  //   this.selectedFile = event.target.files[0];
  //   if (this.selectedFile) {
  //     console.log(`Fichier sélectionné : ${this.selectedFile.name}`);
  //   }
  // }

  // Méthode pour gérer le changement des fichiers
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFile = Array.from(input.files); // Convertir FileList en tableau
    }
  }


  // uploadParticipants(id: number | undefined, toListeDebut: boolean) {
  //   if (!id) {
  //     //console.error('Erreur : ID de l\'étape est 0, impossible de continuer');
  //     Swal.fire({
  //       icon: 'info',
  //       title: '<span class="text-orange-500">Info</span>',
  //       text: 'ID de l\'étape invalide',
  //       confirmButtonText: 'Ok',
  //       customClass: {
  //         confirmButton: 'bg-red-500 text-white hover:bg-red-600',
  //       },
  //     });
  //     return;
  //   }
  //
  //   // Vérifiez si un upload est déjà en cours
  //   if (this.uploading) {
  //     Swal.fire({
  //       icon: 'info',
  //       title: '<span class="text-orange-500">Info</span>',
  //       text: 'Un upload est déjà en cours, veuillez attendre.',
  //       confirmButtonText: 'Ok',
  //       customClass: {
  //         confirmButton: 'bg-red-500 text-white hover:bg-red-600',
  //       },
  //     });
  //     return;
  //   }
  //
  //   if (this.selectedFile) {
  //     this.uploading = true; // Début de l'upload
  //
  //     this.etapeService.uploadParticipants(id, this.selectedFile, toListeDebut).subscribe({
  //       next: () => {
  //         const Toast = Swal.mixin({
  //           toast: true,
  //           position: "top-end",
  //           showConfirmButton: false,
  //           timer: 3000,
  //           timerProgressBar: true,
  //           didOpen: (toast) => {
  //             toast.onmouseenter = Swal.stopTimer;
  //             toast.onmouseleave = Swal.resumeTimer;
  //           }
  //         });
  //         Toast.fire({
  //           icon: "success",
  //           title: "Participants ajoutés avec succès"
  //         });
  //         this.router.navigate(['/etape']);
  //         this.fetchElements(); // Met à jour la liste des étapes
  //
  //         // Réinitialiser le fichier sélectionné
  //         this.selectedFile = null;
  //
  //         // Masquer le formulaire d'upload et afficher la table
  //         this.isUploadFormVisible = false;
  //         this.isTableVisible = true; // Assurez-vous que cette variable est définie correctement
  //
  //         this.uploading = false; // Fin de l'upload
  //       },
  //       error: (err) => {
  //         Swal.fire({
  //           icon: 'error',
  //           title: '<span class="text-red-500">Échec</span>',
  //           text: this.errorMessage,
  //           confirmButtonText: 'Ok',
  //           customClass: {
  //             confirmButton: 'bg-red-500 text-white hover:bg-red-600',
  //           },
  //         });
  //         this.uploading = false; // Fin de l'upload même en cas d'erreur
  //       }
  //     });
  //   } else {
  //     Swal.fire({
  //       icon: 'info',
  //       title: '<span class="text-orange-500">Info</span>',
  //       text: 'Veuillez sélectionner un fichier avant de continuer.',
  //       confirmButtonText: 'Ok',
  //       customClass: {
  //         confirmButton: 'bg-red-500 text-white hover:bg-red-600',
  //       },
  //     });
  //   }
  // }

  // Méthode pour uploader les participants
  uploadParticipants(id: number, toListeDebut: boolean): void {
    if (!id) {
      Swal.fire({
        icon: 'info',
        title: 'Info',
        text: 'ID de l\'étape invalide',
        confirmButtonText: 'Ok',
        customClass: { confirmButton: 'bg-red-500 text-white hover:bg-red-600' }
      });
      return;
    }

    if (this.selectedFile.length > 0) {
      this.uploading = true;
      const uploadPromises = this.selectedFile.map((file) =>
        this.etapeService.uploadParticipants(id, file, toListeDebut).toPromise()
      );

      Promise.all(uploadPromises)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Tous les fichiers ont été uploadés avec succès.'
          });
          this.router.navigate(['/etape']);
          this.selectedFile = [];
          this.uploading = false;
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Échec',
            text: 'Une erreur est survenue lors de l\'upload des fichiers.'
          });
          this.uploading = false;
        });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Info',
        text: 'Veuillez sélectionner au moins un fichier avant de continuer.',
        confirmButtonText: 'Ok',
        customClass: { confirmButton: 'bg-red-500 text-white hover:bg-red-600' }
      });
    }
  }


  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  // ngOnInit(): void {
  //   // Récupération des paramètres depuis l'URL
  //   this.route.params.subscribe(params => {
  //     this.currentEtapeId = +params['etapeId']; // Convertit en number
  //     this.currentEtapeNom = params['etapeNom'];
  //     console.log('Étape ID:', this.currentEtapeId, 'Nom:', this.currentEtapeNom);
  //   });
  // }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const encryptedEtapeId = params.get('etapeId');
      const encryptedEtapeNom = params.get('etapeNom');

      if (encryptedEtapeId && encryptedEtapeNom) {
        // Déchiffrement des données
        const bytesEtapeId = CryptoJS.AES.decrypt(encryptedEtapeId, 'secretKey');
        const decryptedEtapeId = bytesEtapeId.toString(CryptoJS.enc.Utf8);

        const bytesEtapeNom = CryptoJS.AES.decrypt(encryptedEtapeNom, 'secretKey');
        const decryptedEtapeNom = bytesEtapeNom.toString(CryptoJS.enc.Utf8);

        // Affectation des valeurs
        this.currentEtapeId = parseInt(decryptedEtapeId, 10);
        this.currentEtapeNom = decryptedEtapeNom;

        console.log('Etape ID déchiffré:', this.currentEtapeId);
        console.log('Etape Nom déchiffré:', this.currentEtapeNom);
      } else {
        console.error('Paramètres manquants dans l\'URL.');
      }
    });
  }

}
