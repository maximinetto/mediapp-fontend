import { Paciente } from "./paciente";

export class Signo {
    id: number;
    paciente: Paciente;
    fecha: Date;
    temperatura: number;
    pulso: number;
    ritmoRespiratorio: number;
}