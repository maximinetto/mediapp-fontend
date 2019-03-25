import { REINTENTOS } from './var.constants';
import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ServerErrorsInterceptor implements HttpInterceptor {

    constructor(private snackBar: MatSnackBar) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(retry(REINTENTOS)).
            pipe(tap(event => {
                if (event instanceof HttpResponse) {
                    if (event.body && event.body.error === true && event.body.errorMessage) {
                        throw new Error(event.body.errorMessage);
                    }/*else{
                        this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });    
                    }*/
                }
            })).pipe(catchError((err) => {
                console.log(err);
                //https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
                if (err.status === 400) {
                    let mensaje: string;
                    let accion: string;
                    if(err.error.detalles == null){
                        mensaje = err.error.error;
                        accion = err.error.error_description;
                    }
                    else{
                        mensaje = err.error.detalles;
                        accion = err.error.mensaje;
                    }
                    this.snackBar.open( mensaje, accion , 
                    { 
                        duration: 5000,
                        panelClass : ['snackbar']
                    });

                }
                else if (err.status === 401) {
                    console.log(err.message);
                    let mensaje: string;
                    let accion: string;
                    if(err.error.detalles == null){
                        mensaje = err.error.error;
                        accion = err.error.error_description;
                    }
                    else{
                        mensaje = err.error.detalles;
                        accion = err.error.mensaje;
                    }
                    this.snackBar.open(mensaje, accion, { 
                        duration: 5000,
                        panelClass : ['snackbar']
                    });
                    //this.router.navigate(['/login']);
                }
                else if (err.status === 500) {
                    console.log(err.message);
                    let mensaje: string;
                    let accion: string;
                    if(err.error.detalles == null){
                        mensaje = err.error.error;
                        accion = err.error.error_description;
                    }
                    else{
                        mensaje = err.error.detalles;
                        accion = err.error.mensaje;
                    }
                    this.snackBar.open(mensaje, accion, { 
                        duration: 5000,
                        panelClass : ['snackbar']
                    });
                } else {
                    console.log(err.message);
                    let mensaje: string;
                    let accion: string;
                    if(err.error.detalles == null){
                        mensaje = err.error.error;
                        accion = err.error_description;
                    }
                    else{
                        mensaje = err.error.detalles;
                        accion = err.error.mensaje;
                    }
                    this.snackBar.open(mensaje, accion, {
                        duration: 5000,
                        panelClass : ['snackbar']
                    });
                }
                return EMPTY;
            }));
    }
}