import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CritereService {

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  async add(data: any): Promise<any> {
    const url = `${this.BASE_URL}/critere/ajout`;
    try {
      const response = await firstValueFrom(this.http.post<any>(url, data));
      console.log(response);
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du critère:', error);
      throw error;
    }
  }

  async get(): Promise<any> {
    const url = `${this.BASE_URL}/critere/liste`;
    try {
      const response = await firstValueFrom(this.http.get<any>(url));
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des critères:', error);
      throw error;
    }
  }

  async delete(id: number | undefined): Promise<any> {
    const url = `${this.BASE_URL}/critere/supprimer/${id}`;
    try {
      const response = await firstValueFrom(this.http.delete<any>(url));
      return response;
    } catch (error) {
      console.error('Erreur lors de la suppression du critère:', error);
      throw error;
    }
  }

  async update(id: number, data: any): Promise<any> {
    const url = `${this.BASE_URL}/critere/modifier/${id}`;
    try {
      const response = await firstValueFrom(this.http.patch<any>(url, data));
      return response;
    } catch (error) {
      console.error('Erreur lors de la modification du critère:', error);
      throw error;
    }
  }
}
