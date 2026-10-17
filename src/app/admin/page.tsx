'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { ProductoService } from '../../features/productos/services/producto.service';
import { Producto } from '../../features/productos/domain/producto.types';
import { PedidoService } from '../../features/pedidos/services/pedido.service';
import { Pedido } from '../../features/pedidos/domain/pedido.types';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'productos' | 'pedidos'>('productos');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Crear / Editar Producto (SIN campo stock para evitar 500)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'tcg-boxes',
    precio: '',
    imagen: '',
    descripcion: '',
  });

  // Modal Confirmación Eliminar
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push('/');
        return;
      }
      loadData();
    }
  }, [user, isAdmin, authLoading, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, pedRes] = await Promise.all([
        ProductoService.getAll({ limit: 100 }),
        PedidoService.getAll(),
      ]);
      setProductos(prodRes.data);
      setPedidos(pedRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await ProductoService.update(editingProduct.id, {
          nombre: formData.nombre,
          categoria: formData.categoria,
          precio: parseFloat(formData.precio),
          imagen: formData.imagen,
          descripcion: formData.descripcion,
        });
      } else {
        await ProductoService.create({
          nombre: formData.nombre,
          categoria: formData.categoria,
          precio: parseFloat(formData.precio),
          imagen: formData.imagen,
          descripcion: formData.descripcion,
        });
      }
      setIsCreating(false);
      setEditingProduct(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error guardando producto');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await ProductoService.delete(deleteId);
      setDeleteId(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error eliminando producto');
    }
  };

  const handleUpdateEstado = async (id: number, nuevoEstado: string) => {
    try {
      await PedidoService.updateEstado(id, nuevoEstado);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error actualizando estado');
    }
  };

  if (authLoading || loading) {
    return <div className="text-center py-20 text-white">Cargando panel de administración...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Panel de Administración</h1>
          <p className="text-slate-400 text-sm">Gestiona el inventario de PokéVault y los estados de pedidos.</p>
        </div>

        {activeTab === 'productos' && (
          <button
            onClick={() => {
              setFormData({ nombre: '', categoria: 'tcg-boxes', precio: '', imagen: '', descripcion: '' });
              setEditingProduct(null);
              setIsCreating(true);
            }}
            className="bg-poke-red hover:bg-poke-darkred text-white font-medium px-4 py-2 rounded-lg text-sm transition"
          >
            + Nuevo Producto
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('productos')}
          className={`pb-3 font-semibold text-sm transition border-b-2 ${
            activeTab === 'productos' ? 'border-poke-red text-white' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Productos ({productos.length})
        </button>
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`pb-3 font-semibold text-sm transition border-b-2 ${
            activeTab === 'pedidos' ? 'border-poke-red text-white' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Pedidos Globales ({pedidos.length})
        </button>
      </div>

      {/* Tabla Productos */}
      {activeTab === 'productos' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-700">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Imagen</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id} className="border-b border-slate-700/50 hover:bg-slate-700/40">
                  <td className="p-4 font-mono text-xs">{prod.id}</td>
                  <td className="p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={prod.imagen} alt="" className="w-10 h-10 object-contain bg-slate-950 rounded" />
                  </td>
                  <td className="p-4 font-medium text-white">{prod.nombre}</td>
                  <td className="p-4">{prod.categoria}</td>
                  <td className="p-4 text-poke-gold font-bold">${prod.precio.toFixed(2)}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct(prod);
                        setFormData({
                          nombre: prod.nombre,
                          categoria: prod.categoria,
                          precio: prod.precio.toString(),
                          imagen: prod.imagen,
                          descripcion: prod.descripcion,
                        });
                        setIsCreating(true);
                      }}
                      className="px-3 py-1 bg-blue-900/60 text-blue-300 rounded hover:bg-blue-800 text-xs"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeleteId(prod.id)}
                      className="px-3 py-1 bg-red-900/60 text-red-300 rounded hover:bg-red-800 text-xs"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla Pedidos */}
      {activeTab === 'pedidos' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-700">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Usuario</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Cantidad</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((ped) => (
                <tr key={ped.id} className="border-b border-slate-700/50 hover:bg-slate-700/40">
                  <td className="p-4 font-mono text-xs">{ped.id}</td>
                  <td className="p-4">
                    <div className="text-white font-medium">{ped.user?.nombre}</div>
                    <div className="text-xs text-slate-400">{ped.user?.email}</div>
                  </td>
                  <td className="p-4">{ped.producto?.nombre}</td>
                  <td className="p-4">{ped.cantidad}</td>
                  <td className="p-4 text-poke-gold font-bold">${ped.total.toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={ped.estado}
                      onChange={(e) => handleUpdateEstado(ped.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded focus:outline-none"
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="ENVIADO">ENVIADO</option>
                      <option value="ENTREGADO">ENTREGADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Crear / Editar */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl max-w-lg w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Categoría</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded text-sm"
                  >
                    <option value="tcg-boxes">tcg-boxes</option>
                    <option value="psa-cards">psa-cards</option>
                    <option value="consolas">consolas</option>
                    <option value="juegos">juegos</option>
                    <option value="peluches">peluches</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                    className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  required
                  className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 bg-slate-700 text-slate-300 py-2 rounded text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-poke-red hover:bg-poke-darkred text-white font-medium py-2 rounded text-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-bold text-white mb-2">¿Eliminar Producto?</h3>
            <p className="text-slate-400 text-xs mb-6">Esta acción no se puede deshacer y borrará el producto de la base de datos.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-slate-700 text-slate-300 py-2 rounded text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded text-sm"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}