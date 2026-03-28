import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../environments/environment';
import { Agencia } from '../model/agencia';
import { Result } from '../model/result';

@Injectable({
  providedIn: 'root',
})
export class AgenciaService {
  private apiUrl = `${enviroment.apiUrl}/agencias`;

  constructor(private http: HttpClient) {}

  crearAgencia(agencia: Agencia): Observable<Result<Agencia>> {
    return this.http.post<Result<Agencia>>(this.apiUrl, agencia);
  }

  consultarAgencias(): Observable<Result<Agencia[]>> {
    return this.http.get<Result<Agencia[]>>(this.apiUrl);
  }

  getAgenciaById(id: number): Observable<Result<Agencia>> {
    return this.http.get<Result<Agencia>>(`${this.apiUrl}/${id}`);
  }

  consultarPorCiudad(ciudad: string): Observable<Result<Agencia[]>> {
    return this.http.get<Result<Agencia[]>>(`${this.apiUrl}/ciudad/${ciudad}`);
  }

  actualizarAgencia(id: number, agencia: Agencia): Observable<Result<Agencia>> {
    return this.http.put<Result<Agencia>>(`${this.apiUrl}/${id}`, agencia);
  }

  eliminarAgencia(id: number): Observable<Result<Agencia>> {
    return this.http.delete<Result<Agencia>>(`${this.apiUrl}/${id}`);
  }
}
