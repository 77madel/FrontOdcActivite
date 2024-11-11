import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntiteOdcService {

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  async entite(entite: any): Promise<any> {
    const url = `${this.BASE_URL}/entite/ajout`;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    try {
      const response = await this.http.post<any>(url, entite, ).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  getNombreActivites(entiteId: number | undefined): Observable<number> {
    return this.http.get<number>(`${this.BASE_URL}/entite/get/${entiteId}`);
  }

  async get():Promise<any>{
    const url = `${this.BASE_URL}/entite/ListeEntite`;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // })
    try{
      const response =  this.http.get<any>(url).toPromise()
      return response;
    }catch(error){
      throw error;
    }
  }


  async deleteEntite(entiteId: number | undefined):Promise<any>{
    const url = `${this.BASE_URL}/entite/supprimer/${entiteId}`;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // })
    try{
      const response =  this.http.delete<any>(url).toPromise()
      return response;
    }catch(error){
      throw error;
    }
  }

  async updateEntite(entiteId: number, entiteData: any): Promise<any> {
    const url = `${this.BASE_URL}/entite/modifier/${entiteId}`;

    try {
      // Utilisation de await pour attendre la réponse
      const response = await this.http.put<any>(url, entiteData).toPromise();
      return response;
    } catch (error) {
      console.error('Erreur lors de la modification du rôle:', error);
      throw error;
    }
  }
}
