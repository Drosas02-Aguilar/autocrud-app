import { Agencia } from "./agencia";

export interface Auto {
  idauto?: number;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
  precio: number;
  agencia: AgenciaRef;
}

export interface AgenciaRef {
  idagencia?: number;
}
