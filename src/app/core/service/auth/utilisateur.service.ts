import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../../index';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private BASE_URL = 'http://localhost:8080/utilisateur';

  constructor(private http: HttpClient) {}

  // Ajouter un utilisateur
  async add(utilisateur: Utilisateur): Promise<Utilisateur | undefined> {
    const url = `${this.BASE_URL}`;
    try {
      const response = await this.http.post<Utilisateur>(url, utilisateur).toPromise();
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      throw error;
    }
  }

  // Récupérer tous les utilisateurs
  async getAllUtilisateur(): Promise<Utilisateur[] | undefined> {
    const url = `${this.BASE_URL}`;
    try {
      const response = await this.http.get<Utilisateur[]>(url).toPromise();
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  // Récupérer un utilisateur par ID
  async findById(id: number): Promise<Utilisateur | undefined> {
    const url = `${this.BASE_URL}/${id}`;
    try {
      const response = await this.http.get<Utilisateur>(url).toPromise();
      return response;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur avec ID ${id}:`, error);
      throw error;
    }
  }

  // Modifier un utilisateur
  async update(id: number, utilisateur: Utilisateur): Promise<Utilisateur | undefined> {
    const url = `${this.BASE_URL}/${id}`;
    try {
      const response = await this.http.patch<Utilisateur>(url, utilisateur).toPromise();
      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur avec ID ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  async delete(id: number): Promise<void> {
    const url = `${this.BASE_URL}/${id}`;
    try {
      await this.http.delete<void>(url).toPromise();
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur avec ID ${id}:`, error);
      throw error;
    }
  }

  // Récupérer le nombre d'utilisateurs
  async getNombreUtilisateurs(): Promise<number | undefined> {
    const url = `${this.BASE_URL}/nombre`;
    try {
      const response = await this.http.get<number>(url).toPromise();
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre d\'utilisateurs:', error);
      throw error;
    }
  }

  // Modifier le mot de passe
/*  async modifierMotDePasse(data: { [key: string]: string }): Promise<void> {
    const url = `${this.BASE_URL}/change-password`;
    try {
      await this.http.post<void>(url, data).toPromise();
    } catch (error) {
      console.error('Erreur lors de la modification du mot de passe:', error);
      throw error;
    }
  }*/

  changePassword(currentPassword: string, newPassword: string): Promise<any> {
    const url = `${this.BASE_URL}/modifierMotDePasse`;
    const body = {
      currentPassword,
      newPassword,
    };

    return this.http.put(url, body).toPromise();
  }
}
