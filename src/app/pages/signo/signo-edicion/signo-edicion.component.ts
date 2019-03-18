import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { PacienteService } from './../../../_service/paciente.service';
import { map, switchMap, debounceTime, filter } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { SignoService } from './../../../_service/signo.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl('',
      [Validators.required,
        Validators.pattern("[0-9]+(\.[0-9][0-9]?)?"),
         Validators.maxLength(5)]
         ),
      'pulso': new FormControl('',[Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.maxLength(8)]),
      'ritmo': new FormControl('',[Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.maxLength(8)])
    });

    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(
      debounceTime(500),
      switchMap( busqueda => {
        console.log(busqueda);
        if(typeof busqueda === "string")
        {
          return this.signoService.listarPageablePacientes(busqueda);
        }
        else{
          let texto = `${busqueda.nombres} ${busqueda.apellidos}`; 
          return this.signoService.listarPageablePacientes(texto);
        }
      }),
      map( (response: any) => {
        return response;
      }));
  }

  seleccionarPaciente(e: any){
    console.log(`seleccionarPaciente: ${e.option.value}`);
  }

  displayFn(value: Paciente){
    return value? `${value.nombres} ${value.apellidos}`: value;
  }
  
}
