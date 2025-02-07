import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EtapeService} from '../../../../core';
import { CommonModule } from '@angular/common';
import { Person } from '../../../../core/interface/Person';
import { exportToExcel } from '../../../utils/export-utils';
import autoTable, { RowInput } from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-liste-debut',
    imports: [
        CommonModule
    ],
    templateUrl: './liste-debut.component.html',
    styleUrl: './liste-debut.component.css'
})
export class ListeDebutComponent implements OnInit {
  [x: string]: any;

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
    private etapeService: EtapeService,
    private router:Router
  ) {}

  retour(): void {
    this.router.navigate(["/etape"])
  }


  exportExcel(): void {
    exportToExcel(this.listeDebut.map(item => ({
      Nom: item.nom,
      Prenom: item.prenom,
      Email: item.email,
      Genre: item.genre,
      Téléphone: item.phone,
      Activité: item.activite.nom,
    })), 'Liste_Debut');
  }

  exportPDF(): void {
    const doc = new jsPDF();

    // Titre du document
    const title = 'Liste debut des Participants';
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    // Préparer les données pour le tableau (convertir undefined en chaînes vides)
    const tableData = this.listeDebut.map(item => [
      item.nom || '',
      item.prenom || '',
      item.email || '',
      item.genre || '',
      item.phone || '',
      item.activite?.nom || '' // Utiliser '?' pour gérer les propriétés potentiellement nulles ou undefined
    ]);

    // Préparer les en-têtes
    const tableHeaders = ['Nom', 'Prénom', 'Email', 'Genre', 'Téléphone', 'Activité'];

    // Ajouter le tableau au PDF
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData as RowInput[], // Caster en RowInput pour éviter les erreurs de type
      startY: 20, // Positionner le tableau en dessous du titre
    });

    // Télécharger le PDF
    doc.save('Liste_Debut_Participants.pdf');
  }



  // exportPDF(): void {
  //   exportToPDF(this.listeDebut, ['Nom', 'Prénom', 'Email', 'Genre', 'Téléphone', 'Activité'], 'Liste_Resultats');
  // }

}
