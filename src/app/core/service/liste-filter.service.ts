import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListeFilterService {

  private filterSubject = new BehaviorSubject<string>('all');  // 'all' par défaut pour toutes les listes
  currentFilter$ = this.filterSubject.asObservable();

  // Méthode pour filtrer les listes par 'listeDebut'
  setFilterListeDebut() {
    this.filterSubject.next('debut');
  }

  // Méthode pour filtrer les listes par 'listeResultat'
  setFilterListeResultat() {
    this.filterSubject.next('resultat');
  }

  // Réinitialiser le filtre (afficher toutes les listes)
  resetFilter() {
    this.filterSubject.next('all');
  }
}
