import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EtapeService, GlobalCrudService, Participant, ParticipantService} from '../../../../core';
import { CommonModule } from '@angular/common';
import { Person } from '../../../../core/interface/Person';
import { exportToExcel } from '../../../utils/export-utils';
import autoTable, { RowInput } from 'jspdf-autotable';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-liste-debut',
  imports: [
    CommonModule,
    FormsModule
  ],
    templateUrl: './liste-debut.component.html',
    styleUrl: './liste-debut.component.css'
})
export class ListeDebutComponent implements OnInit {
  [x: string]: any

  listeDebut: Person[] = []
  filteredListeDebut: Person[] = [] // For search functionality
  nomEtape = ""

  // Pagination properties
  currentPage = 1
  pageSize = 10
  totalPages = 1

  // Search property
  searchTerm = ""

  constructor(
    private route: ActivatedRoute,
    private etapeService: EtapeService,
    private router: Router,
    private globaleService: GlobalCrudService,
    private readonly participantService: ParticipantService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"))
    console.log("ID reçu:", id)

    this.afficherParticipantsDepuisListe(id)
    // this.fetchParticipants();
  }

  afficherParticipantsDepuisListe(idListe: number) {
    this.globaleService.getId("liste", idListe).subscribe(
      (liste: any) => {
        console.log("Données reçues de la table liste:", liste)

        if (liste) {
          if (liste.listeDebut === true) {
            if (liste.etape && liste.etape.listeDebut && liste.etape.listeDebut.length > 0) {
              // Récupérer les identifiants des participants
              const participantIds = liste.etape.listeDebut.map((participant: any) => participant.id)

              // Récupérer les participants depuis le service participantService
              this.participantService.get().then(
                (participants: any[]) => {
                  // Filtrer les participants en fonction des identifiants récupérés
                  this.listeDebut = participants.filter((participant: any) => participantIds.includes(participant.id))
                  console.log("Participants trouvés:", this.listeDebut)

                  // Initialize filtered list and pagination
                  this.filteredListeDebut = [...this.listeDebut]
                  this.updatePagination()

                  // Récupérer le nom de l'étape
                  this.nomEtape = liste.etape?.nom ?? ""
                  console.log("Nom de l'étape:", this.nomEtape)
                },
                (error: any) => {
                  console.error("Erreur lors de la récupération des participants:", error)
                  this.listeDebut = []
                  this.filteredListeDebut = []
                },
              )
            } else {
              console.warn("Aucun participant trouvé pour cette étape.")
              this.listeDebut = []
              this.filteredListeDebut = []
            }
          } else {
            console.warn("Liste non marquée comme listeDebut.")
            this.listeDebut = []
            this.filteredListeDebut = []
          }
        } else {
          console.warn("Aucune donnée trouvée pour cette liste.")
          this.listeDebut = []
          this.filteredListeDebut = []
          this.nomEtape = ""
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des données:", error)
        this.listeDebut = []
        this.filteredListeDebut = []
        this.nomEtape = ""
      },
    )
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredListeDebut.length / this.pageSize)
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
    }
  }

  // Search method
  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredListeDebut = [...this.listeDebut]
    } else {
      const term = this.searchTerm.toLowerCase().trim()
      this.filteredListeDebut = this.listeDebut.filter(
        (person) =>
          person.nom?.toLowerCase().includes(term) ||
          person.prenom?.toLowerCase().includes(term) ||
          person.email?.toLowerCase().includes(term) ||
          person.genre?.toLowerCase().includes(term) ||
          person.phone?.toLowerCase().includes(term),
      )
    }
    this.currentPage = 1
    this.updatePagination()
  }

  // Get current page items
  get paginatedItems(): Person[] {
    const startIndex = (this.currentPage - 1) * this.pageSize
    return this.filteredListeDebut.slice(startIndex, startIndex + this.pageSize)
  }

  retour(): void {
    this.router.navigate(["/listeGlobale"], {
      queryParams: { filter: "debut" },
      queryParamsHandling: "merge", // Conserver les autres paramètres existants
    })
  }

  exportExcel(): void {
    exportToExcel(
      this.listeDebut.map((item) => ({
        Nom: item.nom,
        Prenom: item.prenom,
        Email: item.email,
        Genre: item.genre,
        Téléphone: item.phone,
        Activité: item.activite.nom,
      })),
      "Liste_Debut",
    )
  }

  exportPDF(): void {
    const doc = new jsPDF()

    // Titre du document
    const title = "Liste debut des Participants"
    doc.setFontSize(16)
    doc.text(title, 14, 15)

    // Préparer les données pour le tableau (convertir undefined en chaînes vides)
    const tableData = this.listeDebut.map((item) => [
      item.nom || "",
      item.prenom || "",
      item.email || "",
      item.genre || "",
      item.phone || "",
      item.activite?.nom || "",
    ])

    // Préparer les en-têtes
    const tableHeaders = ["Nom", "Prénom", "Email", "Genre", "Téléphone", "Activite"]

    // Ajouter le tableau au PDF
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData as RowInput[], // Caster en RowInput pour éviter les erreurs de type
      startY: 20, // Positionner le tableau en dessous du titre
      headStyles: {
        fillColor: [255, 165, 0], // Couleur de fond de l'en-tête (orange ici)
        // textColor: [255, 255, 255], // Couleur du texte (blanc ici)
        // fontSize: 10, // Taille de la police
        // fontStyle: 'bold' // Style de police (gras ici)
      },
    })

    // Télécharger le PDF
    doc.save("Liste_Debut_Participants.pdf")
  }

  // Fonction pour ajouter à la blacklist
  addToBlacklist(participant: any): void {
    // Appeler l'API pour ajouter à la blacklist
    this.globaleService.post("blacklist", participant).subscribe({
      next: (data) => {
        console.log("Participant ajouté à la blacklist:", data)
        // this.getAllBlacklist();  // Recharger la liste des blacklists
        // Afficher un message de succès
        this.showSuccessToast()
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout à la blacklist:", err)
        this.showErrorToast(err) // Afficher un message d'erreur
      },
    })
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
        toast.onmouseenter = Swal.stopTimer
        toast.onmouseleave = Swal.resumeTimer
      },
    })
    Toast.fire({
      icon: "success",
      title: "Adjonction réalisée avec un succès éclatant.",
    })
  }

  // Fonction pour afficher un message d'erreur
  showErrorToast(err: any): void {
    let message = "Une erreur est survenue. Veuillez réessayer."
    if (err.error?.message) {
      message = err.error.message
    } else if (err.message) {
      message = err.message
    }

    Swal.fire({
      icon: "error",
      title: "Échec",
      text: message,
      confirmButtonText: "Ok",
      customClass: {
        confirmButton: "bg-red-500 text-white hover:bg-red-600",
      },
    })
  }
}
