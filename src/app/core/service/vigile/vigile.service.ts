import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Entite} from "../../model/Entite";

@Injectable({
  providedIn: 'root'
})
export class VigileService {

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  async add(data: any): Promise<any> {
    const url = `${this.BASE_URL}/vigile/ajout`;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    try {
      const response = await this.http.post<any>(url, data).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async get():Promise<any>{
    const url = `${this.BASE_URL}/vigile/liste`;
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

  async delete(id: number | undefined):Promise<any>{
    const url = `${this.BASE_URL}/vigile/supprimer/${id}`;
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

  async update(id: number, Data: any): Promise<any> {
    const url = `${this.BASE_URL}/vigile/modifier/${id}`;

    try {
      // Utilisation de await pour attendre la réponse
      const response = await this.http.patch<any>(url, Data).toPromise();
      return response;
    } catch (error) {
      console.error('Erreur lors de la modification du rôle:', error);
      throw error;
    }
  }

}
