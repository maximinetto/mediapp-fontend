import { PacienteService } from './../../../_service/paciente.service';
import { map, switchMap, debounceTime, filter } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { SignoService } from './../../../_service/signo.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {

  form: FormGroup;
  myControlPaciente: FormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  pacientes: Paciente[] = [];


  constructor(private builder: FormBuilder, private signoService: SignoService, private pacienteService: PacienteService) { }

  ngOnInit() {
    this.form = this.builder.group({
      'paciente': this.myControlPaciente
    });

    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(
      debounceTime(500),
      switchMap( busqueda => {
        if(busqueda === ""){
          return this.pacienteService.listarPageable(0,10); 
        }else
        {
          return this.signoService.listarPageablePacientes(busqueda);
        }
      }),
      map( (response: any) => {
        if(response.content != null)
          return response.content;

        return response;
      }));
  }

  seleccionarPaciente(e: any){
    console.log(`seleccionarPaciente: ${e.option.value}`);
  }

  
}
