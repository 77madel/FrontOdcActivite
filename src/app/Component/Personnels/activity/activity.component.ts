import { Component } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, NgForOf, NgIf } from "@angular/common";
import {
  Etape,
  Activity,
  GlobalCrudService, LoginServiceService,
} from '../../../core';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import * as CryptoJS from 'crypto-js';
import {Salle} from '../../../core/model/Salle';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'] // Corrigé de styleUrl à styleUrls
})
export class ActivityComponent {

  activiteList: Activity[] = [];
  etapes: Etape[] = [];
  searchTerm: string = '';
  itemsPerPage = 5;
  currentPage = 1;
  userRoles: string[] = [];
  salle: Salle[] = [];


  get paginated() {
    if (!this.activiteList || this.activiteList.length === 0) {
      return [];
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.activiteList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.activiteList.length / this.itemsPerPage);
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
    private router: Router,
    private loginService: LoginServiceService
  ) {
    this.userRoles = this.loginService.getUserRoles();
  }

  ngOnInit(): void {
    this.getAllActivite();
    this.getAllSalle();
  }

  getAllActivite() {
    this.globalService.get('activite').subscribe({
      next: (value: Activity[]) => {
        this.activiteList = value;
        console.log(this.activiteList)
        },
      error: (err: any) => { console.error(err); }
    });
  }
  getAllSalle() {
    this.globalService.get('salle').subscribe({
      next: (value: Activity[]) => {
        this.salle = value;
        console.log(this.salle)
      },
      error: (err: any) => { console.error(err); }
    });
  }

  naviguerVersFormulaire(): void {
    this.router.navigate(['./ajout-activite/']);
  }

  // updateActivite(id: number | undefined): void {
  //   if (id !== undefined) {
  //     this.router.navigate(['/update-activite', id]);
  //   } else {
  //     console.error('ID non défini');
  //   }
  // }

  updateActivite(id: number | undefined): void {
    if (id !== undefined) {
      // Crypter l'ID avant de le passer dans l'URL
      const encryptedId = CryptoJS.AES.encrypt(id.toString(), 'secretKey').toString();
      this.router.navigate(['/update-activite', encryptedId]);
    } else {
      console.error('ID non défini');
    }
  }



  supprimerActivite(selectedActivite: Activity) {
    this.globalService.delete("activite", selectedActivite.id!).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Eradication diligente pleinement consommée.',
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true
        });
        this.getAllActivite();
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
