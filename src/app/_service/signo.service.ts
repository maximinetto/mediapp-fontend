import { Paciente } from './../_model/paciente';
import { HttpClient } from '@angular/common/http';
import { HOST } from './../_shared/var.constants';
import { Injectable } from '@angular/core';
import {Signo} from '../_model/signo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignoService {
  signoCambio = new Subject<Paciente>();
  mensajeCambio = new Subject<string>();

  url: string = HOST;
  constructor(private http: HttpClient ) { }

  listarPageable(page: number, size: number){
      return this.http.get(`${this.url}/signos/pageable?page=${page}&size=${size}&sort=paciente.apellidos,paciente.nombres`);
  }

  listarPageablePorPaciente(page: number, size: number, busqueda: string){
    return this.http.get(`${this.url}/signos/busqueda/pageable?page=${page}&size=${size}&busqueda=${busqueda}&sort=paciente.nombres,paciente.apellidos,fecha`);
  }

  listarPorId(id: number){
    return this.http.get<Signo>(`${this.url}/signos/${id}`);
  }

  registrar(signo: Signo){
    return this.http.post<Signo>(`${this.url}/signos`, signo);
  }

  modificar(signo: Signo){
    return this.http.put<Signo>(`${this.url}/signos`, signo);
  }

  eliminar(id: number){
    return this.http.delete(`${this.url}/signos/${id}`);
  }

}
