import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EtapeService} from '../../../../core';
import { CommonModule } from '@angular/common';
import { Person } from '../../../../core/interface/Person';

@Component({
  selector: 'app-liste-debut',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './liste-debut.component.html',
  styleUrl: './liste-debut.component.css'
})
export class ListeDebutComponent implements OnInit {

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID reçu:', id);

    this.etapeService.getEtapeByIdFromApi(id).subscribe(
      (data) => {
        console.log('Données reçues de l\'API:', data); // Vérifier la structure des données
        if (data && data.length > 0 && data[0].listeDebut) {
          this.nomEtape = data[0].nom; // Accéder au nom depuis le premier objet
          this.listeDebut = data[0].listeDebut; // Accéder à listeDebut
          console.log('Liste début:', this.listeDebut);
        } else {
          console.error('Aucune étape trouvée ou listeDebut vide pour cet ID.');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }


  listeDebut: Person[] = [];
  nomEtape: string = '';

  constructor(
    private route: ActivatedRoute,
    private etapeService: EtapeService
  ) {}

}
