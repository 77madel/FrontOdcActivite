import {Component, Input} from '@angular/core';
import {Activity, Etape, EtapeService} from '../../../../core';

@Component({
  selector: 'app-etape-activite',
  standalone: true,
  imports: [],
  templateUrl: './etape-activite.component.html',
  styleUrl: './etape-activite.component.css'
})
export class EtapeActiviteComponent {

  @Input() activiteToLink!: Activity;
  etape: Etape[] = [];

  constructor(private etapeService: EtapeService) {}

  ngOnInit(): void {
    this.getEtape();
  }

  getEtape() { /* Implémentation */ }

  updateSelectedEtapes() {
    const selectedEtapes = this.etape.filter(option => option.selected);
    this.activiteToLink.etapes = selectedEtapes.map(etape => ({
      id: etape.id,
      nom: etape.nom
    }));
  }

}
