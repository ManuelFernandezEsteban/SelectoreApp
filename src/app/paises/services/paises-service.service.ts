import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaisesSmall, PaisLarge } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private _baseUrl:string="https://restcountries.com/v2/";
  private _regiones: string[]=['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones():string[]{
    return [...this._regiones];
  }
  constructor(private http:HttpClient) { }

  getPaisesPorRegion(region:string):Observable<PaisesSmall[]>{
    return this.http.get<PaisesSmall[]>(`${this._baseUrl}region/${region}?fields=alpha3Code,name`);
  }

  getPaisByCode(codigo:string):Observable<PaisLarge|null>{

    if(!codigo){
      return of(null);
    }

    return this.http.get<PaisLarge>(`https://restcountries.com/v3.1/alpha/${codigo}`);
  }
}
