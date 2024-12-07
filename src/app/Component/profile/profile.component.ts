import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  activeTab: string = 'profile'; // Onglet par défaut

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

}
