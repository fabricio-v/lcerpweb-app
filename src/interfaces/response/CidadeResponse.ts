import { IEstadoResponse } from './EstadoResponse';

export interface ICidadeResponse {
  id: number;
  nome: string;
  estado: IEstadoResponse;
}
