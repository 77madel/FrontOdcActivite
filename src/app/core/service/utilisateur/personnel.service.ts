import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Entite} from "../../model/Entite";

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  async add(data: any, entite: Entite,token:string): Promise<any> {
    const url = `${this.BASE_URL}/personnel/ajout`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      const response = await this.http.post<any>(url, data, {headers}).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async get(token:string): Promise<any> {
    const url = `${this.BASE_URL}/personnel/liste`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers }).toPromise();
  }


  async delete(id: number | undefined):Promise<any>{
    const url = `${this.BASE_URL}/personnel/supprimer/${id}`;
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

  async update(id: number, Data: any, entite: Entite): Promise<any> {
    const url = `${this.BASE_URL}/personnel/modifier/${id}`;
      //Data.entite.Entite
    try {
      const response = await this.http.patch<any>(url,Data).toPromise();
      return response;
    } catch (error) {
      console.error('Erreur lors de la modification de l\'activité:', error);
      throw error;
    }
  }

}
