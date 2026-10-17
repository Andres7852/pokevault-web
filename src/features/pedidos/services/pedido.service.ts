import { httpClient } from '../../common/http';
import { CreatePedidoPayload, Pedido } from '../domain/pedido.types';

export const PedidoService = {
  create: (payload: CreatePedidoPayload) =>
    httpClient<Pedido>('/pedidos', { method: 'POST', data: payload }),

  getMisPedidos: () => httpClient<Pedido[]>('/pedidos/mias'),

  getAll: () => httpClient<Pedido[]>('/pedidos'),

  updateEstado: (id: number, estado: string) =>
    httpClient<Pedido>(`/pedidos/${id}/estado`, { method: 'PATCH', data: { estado } }),
};