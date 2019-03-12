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

  roles: Rol[] = [];

  username: String;

  constructor() { }

  ngOnInit() {

    this.listar();

  }

  listar(){

    const helper = new JwtHelperService();
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;

    const decodedToken = helper.decodeToken(access_token);
    this.username = decodedToken.user_name;
    const largo = decodedToken.authorities.length;
    for(let i=0; i<largo; i++){
      let rolName = decodedToken.authorities[i];
      let rol : Rol = new Rol();
      rol.nombre = rolName;
      this.roles.push(rol);
    }
      
  }
}
