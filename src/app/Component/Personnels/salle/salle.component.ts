import {Component,  OnInit, ViewEncapsulation} from '@angular/core';
import { MatPaginatorModule} from '@angular/material/paginator';
import {DataTableModule} from '@bhplugin/ng-datatable';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {FormsModule} from '@angular/forms';
import {Activity, GlobalCrudService, LoginServiceService} from '../../../core';
import Swal from 'sweetalert2';
import {Salle} from '../../../core/model/Salle';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-salle',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    AngularSvgIconModule,
    FormsModule,
    MatPaginatorModule,
    DataTableModule,
    NgForOf,
    NgIf,
  ],
  templateUrl: './salle.component.html',
  styleUrl: './salle.component.css'
})
export class SalleComponent  implements OnInit {

  salles: Salle[] = [];
  searchTerm: string = '';
  itemsPerPage = 5;
  currentPage = 1;
  userRoles: string[] = [];



  get paginated() {
    if (!this.salles || this.salles.length === 0) {
      return [];
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.salles.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.salles.length / this.itemsPerPage);
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
    this.getAllSalle();
  }

  getAllSalle() {
    this.globalService.get('salle').subscribe({
      next: (value: Activity[]) => {
        this.salles = value;
        console.log(this.salles)
      },
      error: (err: any) => { console.error(err); }
    });
  }

  naviguerVersFormulaire(): void {
    this.router.navigate(['./ajout-salle']);
  }

  updateSalle(id: number | undefined): void {
    if (id !== undefined) {
      // Crypter l'ID avant de le passer dans l'URL
      const encryptedId = CryptoJS.AES.encrypt(id.toString(), 'secretKey').toString();
      this.router.navigate(['/modifier-salle', encryptedId]);
    } else {
      console.error('ID non défini');
    }
  }



  supprimerSalle(selectedSalle: Salle) {
    this.globalService.delete("salle", selectedSalle.id!).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Eradication diligente pleinement consommée.',
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true
        });
        this.getAllSalle();
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
