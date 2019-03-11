import { JwtHelperService } from '@auth0/angular-jwt';
import { TOKEN_NAME } from './../../_shared/var.constants';
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

    this.listar();

    /*let rol: Rol = new Rol();
    rol.idRol = 1;
    rol.nombre = 'Administrador';
    let rol2: Rol = new Rol();
    rol2.idRol = 2;
    rol2.nombre = 'BD';
    this.roles.push(rol,rol2);*/


  }

  listar(){

    const helper = new JwtHelperService();
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;

    const decodedToken = helper.decodeToken(access_token);
    const largo = decodedToken.authorities.length;
    for(let i=0; i<largo; i++){
      let rolName = decodedToken.authorities[i];
      let rol : Rol = new Rol();
      rol.nombre = rolName;
      this.roles.push(rol);
    }
      
  }
}
