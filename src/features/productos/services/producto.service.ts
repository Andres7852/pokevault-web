import { httpClient } from '../../common/http';
import { PaginatedProductos, Producto } from '../domain/producto.types';

export const ProductoService = {
  getAll: (params?: { page?: number; limit?: number; categoria?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.categoria && params.categoria !== 'todos') query.append('categoria', params.categoria);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return httpClient<PaginatedProductos>(`/productos${queryString}`);
  },

  getById: (id: number) => httpClient<Producto>(`/productos/${id}`),

  create: (data: Omit<Producto, 'id' | 'createdAt'>) =>
    httpClient<Producto>('/productos', { method: 'POST', data }),

  update: (id: number, data: Partial<Omit<Producto, 'id' | 'createdAt'>>) =>
    httpClient<Producto>(`/productos/${id}`, { method: 'PUT', data }),

  delete: (id: number) =>
    httpClient<{ message: string }>(`/productos/${id}`, { method: 'DELETE' }),
};