import { Agencia } from "./agencia";

export interface AgenciaRef {
  idagencia?: number;
  nombre: string;
}


export interface Auto {
  idauto?: number;
  marca: string;
  modelo: string;
  anio: string;
  placa: string;
  color: string;
  precio: number;
  imagen: string;
  agencia: AgenciaRef;
}

