import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../environments/environment';
import { Auto } from '../model/auto';
import { Result } from '../model/result';

@Injectable({
  providedIn: 'root',
})
export class AutoService {
  private apiUrl = `${enviroment.apiUrl}/autos`;

  constructor(private http: HttpClient) {}

  crearAuto(auto: Auto): Observable<Result<Auto>> {
    return this.http.post<Result<Auto>>(this.apiUrl, auto);
  }

  consultarAutos(): Observable<Result<Auto[]>> {
    return this.http.get<Result<Auto[]>>(this.apiUrl);
  }

  getAutoById(id: number): Observable<Result<Auto>> {
    return this.http.get<Result<Auto>>(`${this.apiUrl}/${id}`);
  }

  consutarPorMarca(marca: string): Observable<Result<Auto[]>> {
    return this.http.get<Result<Auto[]>>(`${this.apiUrl}/marca/${marca}`);
  }

  consultarPorAgencias(idAgencia: number): Observable<Result<Auto[]>> {
    return this.http.get<Result<Auto[]>>(`${this.apiUrl}/agencia/${idAgencia}`);
  }

  consultarPorRangoPrecio(precioMin: number, precioMax: number): Observable<Result<Auto[]>> {
    const params = new HttpParams()
      .set('precioMin', precioMin.toString())
      .set('precioMax', precioMax.toString());
    return this.http.get<Result<Auto[]>>(`${this.apiUrl}/precio`, { params });
  }

  editarAuto(id: number, auto: Auto): Observable<Result<Auto>> {
    return this.http.put<Result<Auto>>(`${this.apiUrl}/${id}`, auto);
  }

  eliminarAuto(id: number): Observable<Result<Auto>> {
    return this.http.delete<Result<Auto>>(`${this.apiUrl}/${id}`);
  }
}
