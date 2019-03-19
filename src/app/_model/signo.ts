import { Paciente } from "./paciente";

export class Signo {
    id: number;
    paciente: Paciente;
    fecha: string;
    temperatura: number;
    pulso: number;
    ritmoRespiratorio: number;
}