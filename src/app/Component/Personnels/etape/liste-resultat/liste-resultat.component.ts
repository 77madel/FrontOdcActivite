import { Component, OnInit } from '@angular/core';
import {Person} from '../../../../core/interface/Person';
import {ActivatedRoute, Router} from '@angular/router';
import {EtapeService, GlobalCrudService} from '../../../../core';
import {NgForOf, NgIf} from '@angular/common';
import jsPDF from 'jspdf';
import autoTable, {RowInput} from 'jspdf-autotable';
import {exportToExcel} from '../../../utils/export-utils';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-liste-resultat',
  imports: [
    NgForOf,
    NgIf
  ],
    templateUrl: './liste-resultat.component.html',
    styleUrl: './liste-resultat.component.css'
})
export class ListeResultatComponent implements OnInit{

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID reçu:', id);

    // this.etapeService.getEtapeByIdFromApi(id).subscribe(
    //   (data) => {
    //     console.log('Données reçues de l\'API:', data); // Vérifier la structure des données
    //     if (data && data.length > 0 && data[0].listeResultat) {
    //       this.nomEtape = data[0].nom; // Accéder au nom depuis le premier objet
    //       this.listeResultat = data[0].listeResultat; // Accéder à listeDebut
    //       console.log('listeResultat:', this.listeResultat);
    //     } else {
    //       console.error('Aucune étape trouvée ou listeDebut vide pour cet ID.');
    //     }
    //   },
    //   (error) => {
    //     console.error('Erreur lors de la récupération des données:', error);
    //   }
    // );
    this.afficherParticipantsDepuisListe(id)
  }

  afficherParticipantsDepuisListe(idListe: number) {
    this.globaleService.getId("liste", idListe).subscribe(
      (liste: any) => { // Typage à adapter selon ton modèle
        console.log("Données reçues de la table liste:", liste);

        if (liste) {
          // Vérifier si `listeDebut` est vrai
          if (liste.listeResultat === true) {
            // Récupérer les participants directement depuis `listeDebut` de l'entité `etape`
            if (liste.etape && liste.etape.listeResultat && liste.etape.listeResultat.length > 0) {
              this.listeResultat = liste.etape.listeResultat; // Récupérer la liste début depuis l'étape
              console.log("Participants trouvés:", this.listeResultat);

              // Récupérer le nom de l'étape
              this.nomEtape = liste.etape?.nom ?? ''; // Si l'étape existe, récupérer son nom
              console.log("Nom de l'étape:", this.nomEtape);
            } else {
              console.warn("Aucun participant trouvé pour cette étape.");
              this.listeResultat = [];
            }
          } else {
            console.warn("Liste non marquée comme listeDebut.");
            this.listeResultat = []; // Si listeDebut est faux, on initialise listeDebut comme tableau vide
          }
        } else {
          console.warn("Aucune donnée trouvée pour cette liste.");
          this.listeResultat = [];
          this.nomEtape = '';
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des données:", error);
        this.listeResultat = [];
        this.nomEtape = '';
      }
    );
  }





  listeResultat: Person[] = [];
  nomEtape: string = '';

  constructor(
    private route: ActivatedRoute,
    private etapeService: EtapeService,
    private router:Router,
    private globaleService: GlobalCrudService
  ) {}

  retour(): void {
    this.router.navigate(['/listeGlobale'], {
      queryParams: { filter: 'resultat' },
      queryParamsHandling: 'merge',  // Conserver les autres paramètres existants
    });
  }



  exportExcel(): void {
    exportToExcel(this.listeResultat.map(item => ({
      Nom: item.nom,
      Prenom: item.prenom,
      Email: item.email,
      Genre: item.genre,
      Téléphone: item.phone,
      Activité: item.activite ? item.activite.nom : 'Non spécifié', // ✅ Vérification ici
    })), 'Liste_Resultat');
  }

  exportPDF(): void {
    const doc = new jsPDF();

    // Titre du document
    const title = 'Liste resultat des Participants';
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    // Préparer les données pour le tableau (convertir undefined en chaînes vides)
    const tableData = this.listeResultat.map(item => [
      item.nom || '',
      item.prenom || '',
      item.email || '',
      item.genre || '',
      item.phone || '',
    ]);

    // Préparer les en-têtes
    const tableHeaders = ['Nom', 'Prénom', 'Email', 'Genre', 'Téléphone'];

    // Ajouter le tableau au PDF
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData as RowInput[], // Caster en RowInput pour éviter les erreurs de type
      startY: 20,
      headStyles: {
        fillColor: [255, 165, 0], // Couleur de fond de l'en-tête (orange ici)
        // textColor: [255, 255, 255], // Couleur du texte (blanc ici)
        // fontSize: 10, // Taille de la police
        // fontStyle: 'bold' // Style de police (gras ici)
      },// Positionner le tableau en dessous du titre
    });

    // Télécharger le PDF
    doc.save('Liste_Resultat_Participants.pdf');
  }

  addToBlacklist(participant: any): void {
    // Appeler l'API pour ajouter à la blacklist
    this.globaleService.post('blacklist', participant).subscribe({
      next: (data) => {
        console.log('Participant ajouté à la blacklist:', data);
        // this.getAllBlacklist();  // Recharger la liste des blacklists
        // Afficher un message de succès
        this.showSuccessToast();
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout à la blacklist:', err);
        this.showErrorToast(err);  // Afficher un message d'erreur
      }
    });
  }

  // Fonction pour afficher le toast de succès
  showSuccessToast(): void {
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
  }

  // Fonction pour afficher un message d'erreur
  showErrorToast(err: any): void {
    let message = 'Une erreur est survenue. Veuillez réessayer.';
    if (err.error?.message) {
      message = err.error.message;
    } else if (err.message) {
      message = err.message;
    }

    Swal.fire({
      icon: 'error',
      title: 'Échec',
      text: message,
      confirmButtonText: 'Ok',
      customClass: {
        confirmButton: 'bg-red-500 text-white hover:bg-red-600',
      },
    });
  }

}
