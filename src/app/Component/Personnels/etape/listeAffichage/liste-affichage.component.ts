// liste-affichage.component.ts
import {Component, NgZone, OnInit} from '@angular/core';
import {Activity, GlobalCrudService} from '../../../../core';
import { Liste } from '../../../../core/model/Liste';
import { CommonModule } from '@angular/common';
import { ListeFiltreComponent } from '../liste-global/liste-filtre.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-listeAffichage',
  imports: [CommonModule, RouterLink],
    templateUrl: './liste-affichage.component.html',
    styleUrls: ['./liste-affichage.component.css']
})
export class ListeAffichageComponent implements OnInit {

  listes: Liste[] = [];
  filteredListes: Liste[] = [];

  constructor(
    private globalService: GlobalCrudService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  retour(): void {
    this.router.navigate(["/etape"])
  }


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

  supprimerListe(selectedListe: Liste) {
    this.globalService.delete("liste", selectedListe.id!).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Eradication diligente pleinement consommée.',
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true
        });
        this.getAllListe();
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

  filtrerListeDebutParEtape(etapeNom: string | undefined) {
    this.filteredListes = this.listes.filter(liste => liste.listeDebut === true && liste.etape.nom === etapeNom);
  }




}
