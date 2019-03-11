import { Rol } from './../../_model/rol';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  roles: Rol[] = []

  constructor() { }

  ngOnInit() {
    let rol: Rol = new Rol();
    rol.idRol = 1;
    rol.nombre = 'Administrador';
    let rol2: Rol = new Rol();
    rol2.idRol = 2;
    rol2.nombre = 'BD';
    this.roles.push(rol,rol2);
  }

}
