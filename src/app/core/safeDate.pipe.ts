// Importe les décorateurs et interfaces nécessaires pour créer un pipe transformant les valeurs de date.
import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true, // Indique que ce pipe peut être utilisé indépendamment dans les modules.
  name: 'safeDate' // Nom du pipe utilisé dans le template Angular.
})
@Injectable({
  providedIn: 'root' // Fournit ce pipe au niveau racine pour qu'il soit accessible dans toute l'application.
})
export class SafeDatePipe implements PipeTransform {

  // Méthode de transformation des données en un objet Date.
  transform(value: any): Date | null {

    // Vérifie si la valeur est un tableau de [année, mois, jour, heure, minute, seconde, milliseconde]
    if (Array.isArray(value) && value.length >= 5) {
      const [year, month, day, hour, minute, second = 0, millisecond = 0] = value;
      return new Date(year, month - 1, day, hour, minute, second, millisecond); // Note : Mois est 0-indexé dans Date
    }

    // Si la valeur est une chaîne de nombres séparés par des virgules, convertir en tableau.
    if (typeof value === 'string') {
      const parts = value.split(',').map(part => parseInt(part.trim(), 10)); // Convertit chaque partie en nombre.
      if (parts.length >= 5 && parts.every(num => !isNaN(num))) { // Vérifie que toutes les parties sont des nombres.
        const [year, month, day, hour, minute, second = 0, millisecond = 0] = parts;
        return new Date(year, month - 1, day, hour, minute, second, millisecond); // Construit un objet Date.
      }
    }

    // Si la valeur n'est ni un tableau ni une chaîne, essaie de la convertir directement en Date.
    const parsedDate = new Date(value);
    return isNaN(parsedDate.getTime()) ? null : parsedDate; // Retourne null si la date est invalide.
  }
}
