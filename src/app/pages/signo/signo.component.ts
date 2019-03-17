import { DEFAULT_SIZE_PAGE } from './../../_shared/var.constants';
import { ActivatedRoute } from '@angular/router';
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
  tamanoPagina: number = DEFAULT_SIZE_PAGE;
  pageIndex: number;
  dataSource: MatTableDataSource<Signo>;
  filtro: string = "";



  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private signoService: SignoService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.listar();
  }

  listar(){
    this.pedirPaginado(); 
  }

  pedirPaginado(e?: any) {
     this.pageIndex = 0;
    this.tamanoPagina = DEFAULT_SIZE_PAGE;

    if (e != null) {
      this.pageIndex = e.pageIndex;
      this.tamanoPagina = e.pageSize;      
    }

    if(this.filtro === "")
    {
      this.paginadoSinFiltro();
    }
    else{
      this.paginadoConFiltro();
    }
  }

  paginadoSinFiltro(){
    this.signoService.listarPageable(this.pageIndex, this.tamanoPagina).subscribe((data: any) => {
      let signos = data.content;
      this.cantidad = data.totalElements;

      this.dataSource = new MatTableDataSource(signos);
      //this.dataSource.paginator = this.paginator;
      
    });
  }

  paginadoConFiltro(){
    this.signoService.listarPageablePorPaciente(this.pageIndex, this.tamanoPagina, this.filtro).subscribe(
      (data: any) =>
      {
       let signos = data.content;
       this.cantidad = data.totalElements;
       this.dataSource = new MatTableDataSource(signos);
    });
  }

  mostrarMas( e : any ){
    this.pedirPaginado(e);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    this.filtro = filterValue;

    this.pageIndex = 0;
    this.tamanoPagina = DEFAULT_SIZE_PAGE;

    this.paginadoConFiltro();
  }

  eliminar(idSigno : number){
    this.signoService.eliminar(idSigno).subscribe(() =>{
      this.signoService.listarPageable(this.pageIndex, this.tamanoPagina).subscribe((data: any) => {
        let signos = data.content;
        this.cantidad = data.totalElements;
        
        this.dataSource = new MatTableDataSource(signos);
        //this.dataSource.paginator = this.paginator;
        this.signoService.signoCambio.next(data);
        this.signoService.mensajeCambio.next('SE ELIMINÓ');
      });
    });
  }



}