import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LoginServiceService} from '../../core';

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
export class ProfileComponent {

  activeTab: string = 'profile'; // Onglet par défaut

  user: any = {};

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

  constructor(private authService: LoginServiceService) {}

  // Charger les données utilisateur à partir du token
  loadUser(): void {
    this.user = this.authService.getUserFromLocalStorage();
    console.log(this.user.nom)
    if (!this.user) {
      console.error('Utilisateur non authentifié ou token invalide');
    }
  }

  ngOnInit(): void {
    this.loadUser();
  }

}
