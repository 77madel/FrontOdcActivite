import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { GlobalCrudService, Entite } from '../../../core';
import { CommonModule } from '@angular/common'; // Import de CommonModule

@Component({
  selector: 'app-entite-detail',
  standalone: true,
  imports: [CommonModule], // Ajout de CommonModule ici
  templateUrl: './entite-detail.component.html',
  styleUrls: ['./entite-detail.component.scss'], // Correction de styleUrl à styleUrls
})
export class EntiteDetailComponent implements OnInit {
  entite: Entite | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalCrudService,
  ) {}

  back(): void {
    this.router.navigate(['/entite-odc']);
  }

  ngOnInit(): void {
    const entiteId = this.route.snapshot.paramMap.get('id');
    if (entiteId) {
      this.globalService.getById('entite', entiteId).subscribe((data: any) => {
        this.entite = data;
        console.log(this.entite?.responsable!.nom);
      });
    }
  }
}
