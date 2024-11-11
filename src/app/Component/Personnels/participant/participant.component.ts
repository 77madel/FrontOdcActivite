import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  Activity,
  Participant,
  ParticipantService,
  GlobalCrudService,
  Etape,
  EtapeService
} from '../../../core';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./participant.component.scss']
})
export class ParticipantComponent implements OnInit {
  // Colonnes affichées dans la table
  displayedColumns: string[] = ['nom', 'prenom', 'email', 'phone', 'genre', 'Activite', 'actions'];

  // Données du formulaire (si nécessaire)
  formData: any = {
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    genre: '',
    activite: Activity
  };

  // Liste des participants
  participants: Participant[] = [];
  // Liste des activités
  activites: Activity[] = [];
  // Liste des étapes filtrées en fonction de l'activité sélectionnée
  filteredEtapes: Etape[] = [];
  // Toutes les étapes
  allEtapes: Etape[] = [];

  // Variables pour les filtres
  searchTerm: string = '';
  searchActivite: number | undefined = undefined;
  searchEtape: string = '';
  searchListType: string = '';
  isEtapeSelected: boolean = false;

  // Pagination
  itemsPerPage = 10;
  currentPage = 1;

  // Contrôle de l'affichage
  isFormVisible: boolean = false;
  isTableVisible: boolean = true;

  // Variables supplémentaires
  errorMessage: string = '';
  addElementForm: FormGroup;
  isEditMode = false;
  currentParticipantsId: number | null = null;
  blacklistedEmails: string[] = [];
  blacklistedPhones: string[] = [];

  // URL de l'API
  apiUrl = 'http://localhost:8080';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private readonly participantService: ParticipantService,
    private readonly globalService: GlobalCrudService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private etapeService: EtapeService
  ) {
    this.addElementForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      genre: ['', Validators.required],
      activites: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchParticipants();
    this.fetchActivites();
    this.fetchEtapes();
    this.fetchBlacklistedParticipants();
  }

  // Méthodes pour récupérer les données depuis le backend
  async fetchParticipants() {
    try {
      const response = await this.participantService.get();
      this.participants = response.map((participant: Participant) => ({
        ...participant,
        activite: participant.activite || null,
        isBlacklisted: this.checkIfBlacklisted(participant)
      }));
    } catch (error: any) {
      this.snackBar.open(error.message, 'Fermer', { duration: 3000 });
    }
  }

  fetchBlacklistedParticipants(): void {
    this.globalService.get('blacklist').subscribe({
      next: (data) => {
        this.blacklistedEmails = data.map((item: { email: any }) => item.email);
        this.blacklistedPhones = data.map((item: { phone: any }) => item.phone);
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la récupération des participants blacklistés.', 'Fermer', { duration: 3000 });
      }
    });
  }

  checkIfBlacklisted(participant: Participant): boolean {
    const isEmailBlacklisted = this.blacklistedEmails.includes(participant.email!.toLowerCase());
    const isPhoneBlacklisted = this.blacklistedPhones.includes(participant.phone!);
    return isEmailBlacklisted || isPhoneBlacklisted;
  }

  fetchActivites() {
    this.globalService.get('activite').subscribe({
      next: (value) => {
        this.activites = value;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  async fetchEtapes(): Promise<void> {
    try {
      const response = await this.etapeService.get();
      this.allEtapes = response;
    } catch (error) {
      this.snackBar.open('Erreur lors de la récupération des étapes.', 'Fermer', { duration: 4000 });
    }
  }

  // Gestion des filtres
  onActiviteChange(): void {
    // Mettre à jour les étapes filtrées en fonction de l'activité sélectionnée
    const selectedActivite = this.activites.find((a) => a.id === Number(this.searchActivite));
    this.filteredEtapes = selectedActivite ? selectedActivite.etape || [] : [];
    // Réinitialiser l'étape et le type de liste
    this.searchEtape = '';
    this.searchListType = '';
    this.isEtapeSelected = false;
  }

  onEtapeChange(): void {
    this.isEtapeSelected = !!this.searchEtape;
    if (!this.isEtapeSelected) {
      this.searchListType = '';
    }
  }

  // Filtrage des participants
  get filteredParticipants(): Participant[] {
    return this.participants.filter((participant) => {
      // Filtrage par nom, prénom ou téléphone
      const searchMatches =
        !this.searchTerm ||
        participant.nom!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        participant.prenom!.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        participant.phone!.includes(this.searchTerm);

      // Filtrage par activité
      const activiteMatches =
        !this.searchActivite || (participant.activite && participant.activite.id === Number(this.searchActivite));

      // Filtrage par étape
      const etapeMatches =
        !this.searchEtape ||
        (participant.activite &&
          participant.activite.etape!.some((etape: Etape) => etape.nom === this.searchEtape));

      // Filtrage par liste
      const listeMatches =
        !this.searchListType ||
        (participant.activite &&
          participant.activite.etape!.some((etape: Etape) => {
            if (this.searchListType === 'listeDebut') {
              return etape.listeDebut; // Vérifie que `listeDebut` est true
            } else if (this.searchListType === 'listeResultat') {
              return etape.listeResultat; // Vérifie que `listeResultat` est true
            }
            return false;
          }));

      return searchMatches && activiteMatches && etapeMatches && listeMatches;
    });
  }

  // Pagination
  get paginatedParticipants() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredParticipants.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredParticipants.length / this.itemsPerPage);
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

  // Gestion du check-in
  onCheckInChange(participant: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (participant.checkedIn) {
        console.warn('Participant déjà checké.');
        (event.target as HTMLInputElement).checked = false;
        return;
      }

      this.http.post(`${this.apiUrl}/participant/check-in/${participant.id}`, {}).subscribe(
        (response) => {
          console.log('Check-in réussi:', response);
          participant.checkedIn = true;
        },
        (error) => {
          console.error('Erreur lors du check-in:', error);
          participant.checkedIn = false;
          (event.target as HTMLInputElement).checked = false;
        }
      );
    } else {
      participant.checkedIn = false;
    }
  }
}
