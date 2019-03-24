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

  constructor(private dialogRef: MatDialogRef<PacienteDialogoComponent>, @Inject(MAT_DIALOG_DATA) private data: Paciente, 
  private pacienteService: PacienteService, private signoService: SignoService) { }

  ngOnInit() {
    this.paciente = new Paciente(); 
    
  }

  cancelar(){
    this.dialogRef.close();
  }

  operar(){
    console.log(this.paciente.nombres);
    if(this.isNull() || this.paciente.nombres === "" || this.paciente.apellidos === "" || this.paciente.direccion === "" || 
    this.paciente.email === "" || this.paciente.telefono === "" || this.paciente.dni === ""){
      this.enable = true;
      this.error = "Los campos están vacios";
    }
    else{
      this.enable = false; 
      this.pacienteService.registrar(this.paciente).subscribe(data =>{
        this.signoService.obtenerUltimoPacienteRegistrado().subscribe(data => {
          this.signoService.pacienteRegistro.next(data);
        })
      });
      this.dialogRef.close();
    }
    
  }

  isNull(){
    if(this.paciente.nombres == null || this.paciente.apellidos == null || this.paciente.direccion == null || 
    this.paciente.email == null || this.paciente.telefono == null || this.paciente.dni == null)
      return true;

    return false;
  }

}
