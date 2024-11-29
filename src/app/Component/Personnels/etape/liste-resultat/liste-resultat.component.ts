import { Component, OnInit } from '@angular/core';
import {Person} from '../../../../core/interface/Person';
import {ActivatedRoute} from '@angular/router';
import {EtapeService} from '../../../../core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-liste-resultat',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './liste-resultat.component.html',
  styleUrl: './liste-resultat.component.css'
})
export class ListeResultatComponent implements OnInit{

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID reçu:', id);

    this.etapeService.getEtapeByIdFromApi(id).subscribe(
      (data) => {
        console.log('Données reçues de l\'API:', data); // Vérifier la structure des données
        if (data && data.length > 0 && data[0].listeResultat) {
          this.nomEtape = data[0].nom; // Accéder au nom depuis le premier objet
          this.listeResultat = data[0].listeResultat; // Accéder à listeDebut
          console.log('listeResultat:', this.listeResultat);
        } else {
          console.error('Aucune étape trouvée ou listeDebut vide pour cet ID.');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }


  listeResultat: Person[] = [];
  nomEtape: string = '';

  constructor(
    private route: ActivatedRoute,
    private etapeService: EtapeService
  ) {}

}
