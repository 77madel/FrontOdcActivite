import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Activity} from "../../model/Activity";

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  async add(data: any, activite: Activity): Promise<any> {
    const url = `${this.BASE_URL}/participant/ajout`;
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
    const url = `${this.BASE_URL}/participant/liste`;
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
    const url = `${this.BASE_URL}/participant/supprimer/${id}`;
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

  async update(id: number, Data: any, activite: Activity): Promise<any> {
    const url = `${this.BASE_URL}/participant/modifier/${id}`;

    // Ajouter l'objet 'etape' à 'activityData'
    Data.activite = activite;

    try {
      const response = await this.http.put<any>(url,Data).toPromise();
      return response;
    } catch (error) {
      console.error('Erreur lors de la modification de l\'activité:', error);
      throw error;
    }
  }

}
