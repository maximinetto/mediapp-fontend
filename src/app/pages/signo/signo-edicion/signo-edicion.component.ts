import { PacienteDialogoComponent } from './paciente-dialogo/paciente-dialogo.component';
import { DEFAULT_SIZE_PAGE } from './../../../_shared/var.constants';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { PacienteService } from './../../../_service/paciente.service';
import { map, switchMap, debounceTime, filter } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { SignoService } from './../../../_service/signo.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Signo } from 'src/app/_model/signo';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {

  form: FormGroup;
  myControlPaciente: FormControl = new FormControl('',Validators.required);
  filteredOptions: Observable<any[]>;
  pacientes: Paciente[] = [];

  pacienteSeleccionado: Paciente;

  signoSeleccionado: Signo;

  edicion: boolean = false;

  constructor(private builder: FormBuilder, private signoService: SignoService, private pacienteService: PacienteService,
    private route: ActivatedRoute, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.formatForm();

    this.autocomplete();

    this.route.params.subscribe((params: Params) => {
      let id = params['id'];
      if(id != null)
      {
        this.signoSeleccionado = new Signo();
        this.signoSeleccionado.id = id; 
        this.edicion = true;
      }

    });
    
    this.initForm();

    this.signoService.pacienteRegistro.subscribe(data =>{
      this.myControlPaciente.setValue(data);
      this.pacienteSeleccionado = data;
    })
  }

  formatForm(){
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
  }

  autocomplete(){
    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(
      debounceTime(500),
      switchMap( busqueda => {
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

  initForm(){

    if(this.edicion){
      this.signoService.listarPorId(this.signoSeleccionado.id).subscribe(data =>{
        this.myControlPaciente.setValue(data.paciente);  
        this.pacienteSeleccionado = data.paciente;
        this.form.get('temperatura').setValue(data.temperatura);
        
        let fechaConvertida = new Date(data.fecha.replace(/-/g, '\/'));
        console.log(fechaConvertida);
        this.form.get('fecha').setValue(fechaConvertida);
        this.form.get('ritmo').setValue(data.ritmoRespiratorio);
        this.form.get('pulso').setValue(data.pulso);
      });
    }

  }

  seleccionarPaciente(e: any){
    this.pacienteSeleccionado = e.option.value;
    console.log(`pacienteSeleccionado:${this.pacienteSeleccionado}`)
  }

  displayFn(value: Paciente){
    return value? `${value.nombres} ${value.apellidos}`: value;
  }

  validar(){
    let paciente = this.form.get('paciente').value;
    
    if(typeof paciente === 'string')
      if(this.pacienteSeleccionado != null && paciente === this.pacienteSeleccionado.nombres + ' ' + 
          this.pacienteSeleccionado.apellidos)
        return true;
      else    
        return false;
    else{
      return true;
    }
    
  }

  aceptar(){
    
    if(this.pacienteSeleccionado != null){
      let fecha = this.form.get('fecha').value;
      let fechaConvertida = moment(fecha).format('YYYY-MM-DD');
      let temperatura = this.form.get('temperatura').value;
      let pulso = this.form.get('pulso').value;
      let ritmo = this.form.get('ritmo').value;

      if(!this.edicion){
        let signo = new Signo();
        signo.paciente = this.pacienteSeleccionado;
        signo.fecha = fechaConvertida;
        signo.temperatura = temperatura;
        signo.pulso = pulso;
        signo.ritmoRespiratorio = ritmo;

        this.signoService.registrar(signo).subscribe(() =>{
          this.signoService.listarPageable(0,DEFAULT_SIZE_PAGE).subscribe((data: any) => {
            this.signoService.signoCambio.next(data);
            
          });
          this.signoService.mensajeCambio.next('Se Registró');

        });
      }
      else{
        this.signoSeleccionado.paciente = this.pacienteSeleccionado
        this.signoSeleccionado.fecha = fechaConvertida;
        this.signoSeleccionado.temperatura = temperatura;
        this.signoSeleccionado.pulso = pulso;
        this.signoSeleccionado.ritmoRespiratorio = ritmo;
        
        this.signoService.modificar(this.signoSeleccionado).subscribe(() =>{
          this.signoService.listarPageable(0,DEFAULT_SIZE_PAGE).subscribe((data: any) => {
            this.signoService.signoCambio.next(data);
          });
          this.signoService.mensajeCambio.next('Se modificó');
        });      
      }  
      this.router.navigate(['signo-vitales']);
    }
  }

  cancelar(){
    this.router.navigate(['signo-vitales']);
  }

  openDialog(){
    let paciente = new Paciente();
    this.dialog.open(PacienteDialogoComponent, {
      width: '250px',
      data: paciente
    });
  }
  
}
