import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LoginServiceService} from '../../core';
import {Router} from '@angular/router';

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

  activeTab: string = 'profile'; // Onglet par défaut

  user: any = {
    nom: '',
    prenom: '',
    email: '',
    phone: '',
  };

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.user.profilePicture = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  constructor(
    private authService: LoginServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }
  //
  // loadUser(): void {
  //   this.user = this.authService.currentUserValue;
  //   if (!this.user || Object.keys(this.user).length === 0) {
  //     console.error('Utilisateur non authentifié');
  //     this.router.navigate(['/sign-in']); // Redirection si pas d'utilisateur
  //   } else {
  //     console.log('Données utilisateur récupérées:', this.user);
  //   }
  // }

  loadUser(): void {
    const user = this.authService.currentUserValue;

    if (user && Object.keys(user).length > 0) {
      this.user.nom = user.nom;       // Accès aux données
      this.user.prenom = user.prenom;
      this.user.email = user.email;
      this.user.phone = user.phone;

      console.log('Données utilisateur récupérées:', this.user);
    } else {
      console.error('Utilisateur non authentifié ou données manquantes');
      this.router.navigate(['/sign-in']); // Redirection si pas d'utilisateur
    }
  }

}
