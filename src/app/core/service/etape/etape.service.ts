import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Activity } from '../../model/Activity';
import { Etape } from '../../model/Etape';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtapeService {
  private etapeId: number | undefined;
  private etapeNom: string | undefined;

  setEtapeData(id: number, nom: string): void {
    this.etapeId = id;
    this.etapeNom = nom;
  }

  getEtapeId(): number | undefined {
    return this.etapeId;
  }

  getEtapeNom(): string | undefined {
    return this.etapeNom;
  }

  clearData(): void {
    this.etapeId = undefined;
    this.etapeNom = undefined;
  }

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  async add(data: Etape[]): Promise<Etape[] | undefined> {
    const url = `${this.BASE_URL}/etape/ajout`;

    try {
      const response = await this.http.post<Etape[]>(url, data).toPromise();
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'ajout des étapes:', error);
      throw error; // Vous pouvez gérer l'erreur ici si nécessaire
    }
  }

  // private etape: any[] = [];
  //
  // setEtapes(etape: any[]): void {
  //   this.etape = etape;
  // }
  //
  // getEtapeById(id: number): any {
  //   return this.etape.find((etape: any) => etape.id === id);
  // }

  getEtapeByIdFromApi(encryptedId: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/etape/liste/${encryptedId}`);
  }




  async get():Promise<any>{
    const url = `${this.BASE_URL}/etape/liste`;
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
    const url = `${this.BASE_URL}/etape/supprimer/${id}`;
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
    const url = `${this.BASE_URL}/etape/modifier/${id}`;

    try {
      // Utilisation de await pour attendre la réponse
      const response = await this.http.patch<any>(url, Data).toPromise();
      return response;
    } catch (error) {
      console.error('Erreur lors de la modification du rôle:', error);
      throw error;
    }
  }

  uploadParticipants(id: number, file: File, toListeDebut: boolean) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('toListeDebut', toListeDebut.toString());

    const url = `http://localhost:8080/etape/${id}/participants/upload`;
    console.log('Appel API à l\'URL :', url);  // Vérifiez l'URL

    return this.http.post(url, formData);
  }
}
