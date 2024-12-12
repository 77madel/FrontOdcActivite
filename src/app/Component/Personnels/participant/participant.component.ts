import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  Activity,
  Participant,
  ParticipantService,
  GlobalCrudService,
  Etape,
  EtapeService, LoginServiceService
} from '../../../core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  styleUrls: ['./participant.component.scss']
})
export class ParticipantComponent implements OnInit {
  // Colonnes affichées dans la table
  displayedColumns: string[] = ['nom', 'prenom', 'email', 'phone', 'genre', 'Activite', 'actions'];

  // Liste des participants
  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];

  // Liste des activités
  activites: Activity[] = [];
  userRoles: string[] = [];

  // Liste des étapes filtrées en fonction de l'activité sélectionnée
  filteredEtapes: Etape[] = [];

  // Toutes les étapes
  allEtapes: Etape[] = [];

  // Formulaire de filtres
  filtersForm: FormGroup;

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
    private etapeService: EtapeService,
    private loginService: LoginServiceService
  ) {
    this.addElementForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      genre: ['', Validators.required],
      activites: ['', Validators.required]
    });
    this.userRoles = this.loginService.getUserRoles();

    // Initialisation du formulaire de filtres
    this.filtersForm = this.fb.group({
      searchTerm: [''],
      searchActivite: [''],
      searchEtape: [''],
      searchListType: ['']
    });
  }

  ngOnInit(): void {
    // Utiliser async/await pour s'assurer de l'ordre de récupération
    this.initializeData();

    // Abonnement aux changements du formulaire de filtres
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(filters => this.applyFilters(filters))
      )
      .subscribe(filteredParticipants => {
        this.filteredParticipants = filteredParticipants;
        this.currentPage = 1;
      });
  }

  async initializeData() {
    await this.fetchEtapes();
    await this.fetchActivites();
    await this.fetchParticipants();
    this.fetchBlacklistedParticipants();
  }

  // Méthodes pour récupérer les données depuis le backend
  async fetchParticipants() {
    try {
      const response = await this.participantService.get();
      this.participants = response.map((participant: any) => ({
        ...participant,
        activite: participant.activite || null,
        isBlacklisted: this.checkIfBlacklisted(participant)
      }));

      // Initialisation des participants filtrés
      this.filteredParticipants = [...this.participants];
    } catch (error: any) {
      this.snackBar.open(error.message, 'Fermer', { duration: 3000 });
    }
  }

  fetchBlacklistedParticipants(): void {
    this.globalService.get('blacklist').subscribe({
      next: (data) => {
        this.blacklistedEmails = data.map((item: { email: any }) => item.email.toLowerCase());
        this.blacklistedPhones = data.map((item: { phone: any }) => item.phone);
        // Après avoir récupéré la blacklist, mettre à jour les participants
        this.participants = this.participants.map((participant) => ({
          ...participant,
          isBlacklisted: this.checkIfBlacklisted(participant)
        }));

        // Mettre à jour les participants filtrés
        this.filteredParticipants = [...this.participants];
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la récupération des participants blacklistés.', 'Fermer', { duration: 3000 });
      }
    });
  }

  checkIfBlacklisted(participant: Participant): boolean {
    const isEmailBlacklisted = participant.email ? this.blacklistedEmails.includes(participant.email.toLowerCase()) : false;
    const isPhoneBlacklisted = participant.phone ? this.blacklistedPhones.includes(participant.phone) : false;
    return isEmailBlacklisted || isPhoneBlacklisted;
  }

  fetchActivites() {
    this.globalService.get('activite').subscribe({
      next: (value) => {
        // Normalisation de 'etape' pour qu'il soit toujours un tableau
        this.activites = value.map((activite: any) => ({
          ...activite,
          etape: Array.isArray(activite.etape) ? activite.etape : activite.etape ? [activite.etape] : []
        }));
        console.log('Activités normalisées :', this.activites);
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open('Erreur lors de la récupération des activités.', 'Fermer', { duration: 3000 });
      }
    });
  }

  async fetchEtapes(): Promise<void> {
    try {
      const response = await this.etapeService.get();
      this.allEtapes = response || [];
      console.log('Étapes récupérées :', this.allEtapes);

      // Initialiser filteredEtapes avec toutes les étapes par défaut
      this.filteredEtapes = [...this.allEtapes];
    } catch (error) {
      console.error('Erreur lors de la récupération des étapes :', error);
      this.snackBar.open('Erreur lors de la récupération des étapes.', 'Fermer', { duration: 4000 });
    }
  }

  // Gestion des filtres
  onActiviteChange(): void {
    const selectedActiviteId = this.filtersForm.value.searchActivite;
    if (selectedActiviteId) {
      const selectedActivite = this.activites.find((a) => a.id === Number(selectedActiviteId));
      console.log('Activité sélectionnée :', selectedActivite);

      this.filteredEtapes = selectedActivite && selectedActivite.etape ? selectedActivite.etape : [];
      console.log('Étapes filtrées :', this.filteredEtapes);
    } else {
      // Si aucune activité n'est sélectionnée, afficher toutes les étapes
      this.filteredEtapes = [...this.allEtapes];
      console.log('Aucune activité sélectionnée, affichage de toutes les étapes :', this.filteredEtapes);
    }

    // Réinitialiser les autres filtres liés
    this.filtersForm.patchValue({ searchEtape: '', searchListType: '' }, { emitEvent: false });
  }

  onEtapeChange(): void {
    if (!this.filtersForm.value.searchEtape) {
      this.filtersForm.patchValue({ searchListType: '' }, { emitEvent: false });
    }
  }

  // Nouvelle méthode de filtrage avancée
  applyFilters(filters: any) {
    let filtered = [...this.participants];

    // Filtrage par terme de recherche
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(participant =>
        (participant.nom && participant.nom.toLowerCase().includes(term)) ||
        (participant.prenom && participant.prenom.toLowerCase().includes(term)) ||
        (participant.phone && participant.phone.includes(term))
      );
    }

    // Filtrage par activité
    if (filters.searchActivite) {
      filtered = filtered.filter(participant =>
        participant.activite && participant.activite.id === Number(filters.searchActivite)
      );
    }

    // Filtrage par étape
    if (filters.searchEtape) {
      filtered = filtered.filter(participant =>
        participant.activite?.etape &&
        participant.activite.etape.some((etape: Etape) => etape.nom === filters.searchEtape)
      );
    }

    // Filtrage par liste
    if (filters.searchListType) {
      filtered = filtered.filter(participant =>
        participant.activite?.etape &&
        participant.activite.etape.some((etape: Etape) => {
          if (filters.searchListType === 'listeDebut') {
            return etape.listeDebut && etape.listeDebut.length > 0;
          } else if (filters.searchListType === 'listeResultat') {
            return etape.listeResultat && etape.listeResultat.length > 0;
          }
          return false;
        })
      );
    }

    return of(filtered);
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
  onCheckInChange(participant: Participant, event: Event) {
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
          participant.checkInTime = new Date(); // Enregistrer l'heure du check-in
        },
        (error) => {
          console.error('Erreur lors du check-in:', error);
          participant.checkedIn = false;
          (event.target as HTMLInputElement).checked = false;
        }
      );
    } else {
      participant.checkedIn = false;
      participant.checkInTime = null;
    }
  }
}
