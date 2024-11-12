import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalCrudService, Entite, Utilisateur } from '../../../core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-entite-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entite-detail.component.html',
  styleUrls: ['./entite-detail.component.css'],
})
export class EntiteDetailComponent implements OnInit {
  entite: Entite | null = null;
  entiteToAdd: Entite = new Entite();
  selectedUtilisateurId: number | null = null;
  isEditMode = false;
  isFormVisible = false;
  isDetailVisible = true;

  utilisateursPersonnels: Utilisateur[] = [];
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalCrudService
  ) {}

  ngOnInit(): void {
    const entiteId = this.route.snapshot.paramMap.get('id');
    if (entiteId) {
      this.globalService.getById('entite', entiteId).subscribe((data: Entite) => {
        this.entite = data;
        this.entiteToAdd = { ...data };
        this.selectedUtilisateurId = data.responsable?.id || null;
        this.getAllUtilisateursPersonnels();
      });
    } else {
      this.getAllUtilisateursPersonnels();
    }
  }

  back(): void {
    this.router.navigate(['/entite-odc']);
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    this.isDetailVisible = !this.isDetailVisible;
  }

  getAllUtilisateursPersonnels() {
    this.globalService.get('utilisateur').subscribe({
      next: (value: Utilisateur[]) => {
        if (Array.isArray(value)) {
          this.utilisateursPersonnels = value.filter(
            (user) =>
              user.role &&
              user.role.nom === 'PERSONNEL' ||
              user.id === this.entite?.responsable?.id
          );
        }
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
      },
    });
  }

  modifierEntite() {
    this.isEditMode = true;
    this.toggleForm();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  updateEntite() {
    const formData = new FormData();

    formData.append(
      'entiteOdc',
      new Blob([JSON.stringify(this.entiteToAdd)], { type: 'application/json' })
    );

    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }

    if (this.selectedUtilisateurId) {
      formData.append('utilisateurId', this.selectedUtilisateurId.toString());
    } else {
      console.error('Aucun utilisateur sélectionné ou ID non disponible.');
      return;
    }

    this.globalService.update('entite', this.entiteToAdd.id!, formData).subscribe({
      next: (data) => {
        console.log(data);
        this.entite = { ...this.entiteToAdd };
        this.toggleForm();
        this.isEditMode = false;
        this.selectedFile = null;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
