import { Agencia } from "./agencia";

export interface AgenciaRef {
  idagencia?: number;
}


export interface Auto {
  idauto?: number;
  marca: string;
  modelo: string;
  anio: string;
  placa: string;
  color: string;
  precio: number;
  agencia: AgenciaRef;
}

