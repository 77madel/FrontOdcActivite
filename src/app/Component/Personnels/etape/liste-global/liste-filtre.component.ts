// liste-filtre.component.ts
import {Component, EventEmitter, NgZone, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Liste} from '../../../../core/model/Liste';
import {GlobalCrudService} from '../../../../core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-liste-filtre',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-filtre.component.html',
  styleUrls: ['./liste-filtre.component.css']
})
export class ListeFiltreComponent {

  isOpen = false; // Pour gérer l'affichage du modal
  filteredListes: Liste[] = [];
  listes: Liste[] = [];

  constructor(private globalService: GlobalCrudService,
              private ngZone: NgZone,
              private router: Router) { }


  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  filterByDebut() {
    this.router.navigate(['/listeGlobale'], { queryParams: { filter: 'debut' } });
    this.closeModal();
  }

  filterByResultat() {
    this.router.navigate(['/listeGlobale'], { queryParams: { filter: 'resultat' } });
    this.closeModal();
  }

  resetFilter() {
    this.router.navigate(['/listeGlobale'], { queryParams: { filter: 'all' } });
    this.closeModal();
  }

  getAllListe() {
    this.globalService.get("liste").subscribe({
      next: (value: Liste[]) => {
        this.ngZone.run(() => {
          this.listes = value;
          this.filteredListes = [...this.listes]; // Initialisation avec toutes les listes
        });
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des données:', err);
      }
    });
  }

  applyFilter(filter: string) {
    switch (filter) {
      case 'debut':
        this.filteredListes = this.listes.filter(liste => liste.listeDebut === true);
        break;
      case 'resultat':
        this.filteredListes = this.listes.filter(liste => liste.listeResultat === true);
        break;
      case 'all':
      default:
        this.filteredListes = [...this.listes]; // Afficher toutes les listes
        break;
    }
  }
}
