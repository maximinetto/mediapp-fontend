import { FormGroup, FormControl } from '@angular/forms';
import { SignoService } from './../../../../_service/signo.service';
import { PacienteService } from './../../../../_service/paciente.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Paciente } from 'src/app/_model/paciente';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  paciente: Paciente;
  enable: boolean = false;
  error: string;
  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<PacienteDialogoComponent>, @Inject(MAT_DIALOG_DATA) private data: Paciente, 
  private pacienteService: PacienteService, private signoService: SignoService) { }

  ngOnInit() {
    this.paciente = new Paciente(); 
    this.form = new FormGroup({
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'direccion': new FormControl(''),
      'telefono': new FormControl(''),
      'email': new FormControl('')
    });
  }

  cancelar(){
    this.dialogRef.close();
  }

  operar(){
    this.createPaciente();

    this.pacienteService.registrar(this.paciente).subscribe(data =>{
      this.signoService.obtenerUltimoPacienteRegistrado().subscribe(data => {
        this.signoService.pacienteRegistro.next(data);
      })
    });
    this.dialogRef.close();
    
  }

  isNull(){
    if(this.paciente.nombres == null || this.paciente.apellidos == null || this.paciente.direccion == null || 
    this.paciente.email == null || this.paciente.telefono == null || this.paciente.dni == null)
      return true;

    return false;
  }

  createPaciente(): void{
    this.paciente.nombres = this.form.get("nombres").value;
    this.paciente.apellidos = this.form.get("apellidos").value;
    this.paciente.direccion = this.form.get("direccion").value;
    this.paciente.dni = this.form.get("dni").value;
    this.paciente.telefono = this.form.get("telefono").value;
    this.paciente.email = this.form.get("email").value;
  }
}
