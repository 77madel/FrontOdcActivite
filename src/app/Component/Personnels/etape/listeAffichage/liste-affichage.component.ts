// liste-affichage.component.ts
import {Component, NgZone, OnInit} from '@angular/core';
import { GlobalCrudService } from '../../../../core';
import { Liste } from '../../../../core/model/Liste';
import { CommonModule } from '@angular/common';
import { ListeFiltreComponent } from '../liste-global/liste-filtre.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-listeAffichage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-affichage.component.html',
  styleUrls: ['./liste-affichage.component.css']
})
export class ListeAffichageComponent implements OnInit {

  listes: Liste[] = [];
  filteredListes: Liste[] = [];

  constructor(
    private globalService: GlobalCrudService,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.getAllListe();

    // Récupérer le filtre depuis les paramètres d'URL
    this.route.queryParams.subscribe(params => {
      if (params['filter']) {
        this.applyFilter(params['filter']);
      }
    });
  }

  getAllListe() {
    this.globalService.get("liste").subscribe({
      next: (value: Liste[]) => {
        this.ngZone.run(() => {
          this.listes = value;
          // Appliquer le filtre après récupération des données
          const currentFilter = this.route.snapshot.queryParams['filter'] || 'all';
          this.applyFilter(currentFilter);        });
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
        this.filteredListes = [...this.listes];
        break;
    }
  }



}
