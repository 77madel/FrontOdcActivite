import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {
  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  async role(role: any): Promise<any> {
    const url = `${this.BASE_URL}/role/ajout`;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    console.log("Sending request to:", url);
    try {
      const response = await this.http.post<any>(url, role, ).toPromise();
      console.log("Response received:", response);
      return response;
    } catch (error) {
      console.error("Error occurred:", error);
      throw error;
    }
  }

  async getAllRole():Promise<any>{
    const url = `${this.BASE_URL}/role/listeRole`;
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

  async deleteRole(roleId: number | undefined):Promise<any>{
    const url = `${this.BASE_URL}/role/supprimer/${roleId}`;
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

  async updateRole(roleId: number, roleData: any): Promise<any> {
    const url = `${this.BASE_URL}/role/modifier/${roleId}`;

    try {
      // Utilisation de await pour attendre la réponse
      const response = await this.http.put<any>(url, roleData).toPromise();
      return response;
    } catch (error) {
      console.error('Erreur lors de la modification du rôle:', error);
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Erreur ${error.status}: ${error.error}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
