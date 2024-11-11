import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Etape } from '../../model/Etape';

@Injectable({
  providedIn: 'root'
})
export class ActiviteService {

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  async activity(activity: any, etape: Etape): Promise<any> {
    const url = `${this.BASE_URL}/activite/ajout`;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    try {
      const response = await this.http.post<any>(url, activity).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllActivity():Promise<any>{
    const url = `${this.BASE_URL}/activite/listeActivite`;
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

  async deleteActivity(activityId: number | undefined):Promise<any>{
    const url = `${this.BASE_URL}/activite/supprimer/${activityId}`;
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

  async updateActivity(activityId: number, activityData: any, etape: Etape): Promise<any> {
    const url = `${this.BASE_URL}/activite/modifier/${activityId}`;

    // Ajouter l'objet 'etape' à 'activityData'
    activityData.etape = etape;

    try {
      const response = await this.http.put<any>(url, activityData).toPromise();
      return response;
    } catch (error) {
      console.error('Erreur lors de la modification de l\'activité:', error);
      throw error;
    }
  }

}
