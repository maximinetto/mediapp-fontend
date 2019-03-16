import { SignoService } from './../../_service/signo.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Signo } from 'src/app/_model/signo';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent implements OnInit {

  displayedColumns = ['id', 'dniPaciente', 'nombrePaciente', 'fecha', 'acciones'];
  cantidad: number;
  tamanoPagina: number = 10;
  pageIndex: number;
  dataSource: MatTableDataSource<Signo>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private signoService: SignoService) { }

  ngOnInit() {
    this.listar();
  }

  listar(){
    this.pedirPaginado(); 
  }

  pedirPaginado(e?: any) {
     this.pageIndex = 0;
    this.tamanoPagina = 10;

    if (e != null) {
      this.pageIndex = e.pageIndex;
      this.tamanoPagina = e.pageSize;      
    }

    this.signoService.listarPageable(this.pageIndex, this.tamanoPagina).subscribe((data: any) => {
      let signos = data.content;
      this.cantidad = data.totalElements;

      this.dataSource = new MatTableDataSource(signos);
      //this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  mostrarMas( e : any ){
    this.pedirPaginado(e);
  }

  eliminar(idSigno : number){
    this.signoService.eliminar(idSigno).subscribe(() =>{
      this.signoService.listarPageable(this.pageIndex, this.tamanoPagina).subscribe((data: any) => {
        let signos = data.content;
        this.cantidad = data.totalElements;
        
        this.dataSource = new MatTableDataSource(signos);
        //this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.signoService.signoCambio.next(data);
        this.signoService.mensajeCambio.next('SE ELIMINÓ');
      });
    });
  }



}
