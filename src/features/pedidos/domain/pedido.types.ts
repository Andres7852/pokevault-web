import { Producto } from '../../productos/domain/producto.types';

export interface Pedido {
  id: number;
  userId: number;
  productoId: number;
  cantidad: number;
  mensaje: string;
  total: number;
  estado: string;
  createdAt: string;
  producto: Producto;
  user?: {
    id: number;
    nombre: string;
    email: string;
  };
}

export interface CreatePedidoPayload {
  productoId: number;
  cantidad: number;
  mensaje: string;
}