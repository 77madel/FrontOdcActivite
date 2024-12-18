import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LoginServiceService, PersonnelService, Utilisateur} from '../../core';
import {Router} from '@angular/router';
import {UtilisateurService} from '../../core/service/auth/utilisateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  activeTab: string = 'profile'; // Onglet actif par défaut
  user: Utilisateur = {
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    genre: '',
    role: undefined,
    entite: undefined,
  };
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  profilePicture: string | null = null; // Pour la prévisualisation de l'image
  errors: string[] = []; // Liste des erreurs pour validation des données

  constructor(
    private authService: LoginServiceService,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  async loadUser(): Promise<void> {
    const currentUserId = this.authService.getUserpourprofilFromLocalStorage()?.id;

    console.log('Contenu de localStorage:', localStorage.getItem('currentUser'));
    console.log('ID récupéré:', currentUserId);

    if (!currentUserId) {
      console.error('Utilisateur non authentifié ou ID manquant');
      this.router.navigate(['/sign-in']);
      return;
    }

    try {
      const currentUser = await this.utilisateurService.findById(currentUserId);
      if (currentUser) {
        this.user = { ...currentUser }; // Copie des données utilisateur
        console.log('Données utilisateur chargées:', this.user);
      } else {
        console.error('Aucun utilisateur trouvé avec cet ID.');
        this.router.navigate(['/sign-in']);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données utilisateur:', err);
      this.router.navigate(['/sign-in']);
    }
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicture = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  saveProfile(): void {
    if (!this.validateUserData()) return;

    const userId = this.user.id;
    if (!userId) {
      console.error('ID utilisateur manquant.');
      return;
    }

    this.utilisateurService.update(userId, this.user)
      .then((response) => {
        Swal.fire({
          title: 'Modifications sauvegardées.',
          text: 'Les modifications opérées sur les paramètres de votre identité numérique ont été dûment enregistrées dans les arcanes du système, conformément aux protocoles de sécurisation des données personnelles en vigueur, garantissant ainsi la pérennité de votre profil au sein de notre plateforme.',
          icon: 'success',
          confirmButtonText: 'D\'accord',
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Une erreur est survenue.',
          text: 'Un contretemps imprévu a perturbé le processus de sauvegarde de vos données. Il est fortement recommandé de réitérer l\'opération après avoir vérifié les éléments d\'entrée et d\'assurance qualité.',
          icon: 'error',
          confirmButtonText: 'Essayer à nouveau',
        });
      });
  }

  changePassword(): void {
    // Vérifier que le nouveau mot de passe et la confirmation correspondent
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        title: 'Erreur fatale!',
        text: 'Les mots de passe ne coïncident pas dans l’infinité des possibles, dans un univers parallèle où l’entropie règne en maître et où la logique des choses est suspendue aux lois de l’irrationalité.',
        icon: 'error',
        confirmButtonText: 'Ok, je comprends.'
      });
      return;
    }

    // Vérifier que le mot de passe respecte une certaine longueur minimale
    if (this.newPassword.length < 6) {
      Swal.fire({
        title: 'Erreur critique!',
        text: 'Le nouveau mot de passe, semblable à une cryptographie insaisissable, doit posséder une longueur minimale de six caractères, condition sine qua non à l’accès au monde des secrets numériques!',
        icon: 'error',
        confirmButtonText: 'Compris, je m’y mets!'
      });
      return;
    }

    // Appel à votre service backend pour modifier le mot de passe
    this.utilisateurService.changePassword(this.currentPassword, this.newPassword)
      .then(() => {
        Swal.fire({
          title: 'Succès éclatant!',
          text: 'Le mot de passe a été mis à jour avec succès, marquant ainsi une étape mémorable dans la quête de la sécurité infinie de vos données personnelles!',
          icon: 'success',
          confirmButtonText: 'Merci, je vais de ce pas explorer la suite!'
        });
        this.router.navigate(['/profile']);
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
        Swal.fire({
          title: 'Échec dans la dimension parallèle!',
          text: 'Une erreur cosmique est survenue lors de la tentative de mise à jour du mot de passe, peut-être provoquée par des forces invisibles qui défient la compréhension humaine...',
          icon: 'error',
          confirmButtonText: 'Je vais re-tenter!'
        });
      });
  }

  private validateUserData(): boolean {
    this.errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.user.nom) this.errors.push('Le champ "Nom" est obligatoire.');
    if (!this.user.prenom) this.errors.push('Le champ "Prénom" est obligatoire.');
    if (!this.user.email || !emailRegex.test(this.user.email)) {
      this.errors.push('Le champ "Email" est obligatoire et doit être valide.');
    }

    return this.errors.length === 0;
  }
}
