'use client';

import React, { useState } from 'react';
import { Producto } from '../../productos/domain/producto.types';
import { PedidoService } from '../services/pedido.service';

interface Props {
  producto: Producto;
  onClose: () => void;
  onSuccess: () => void;
}

export const PedidoForm = ({ producto, onClose, onSuccess }: Props) => {
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = producto.precio * cantidad;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await PedidoService.create({
        productoId: producto.id,
        cantidad,
        mensaje,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-2">Completar Pedido</h3>
        <p className="text-slate-400 text-sm mb-4">{producto.nombre}</p>

        {error && (
          <div className="bg-red-950/60 border border-red-500 text-red-300 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Cantidad</label>
            <input
              type="number"
              min="1"
              max="10"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Dirección / Mensaje de Envío</label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Indica la dirección y detalles de entrega..."
              rows={3}
              required
              className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg"
            />
          </div>

          <div className="flex justify-between items-center py-2 border-t border-slate-700">
            <span className="text-slate-400">Total a pagar:</span>
            <span className="text-xl font-bold text-poke-gold">${total.toFixed(2)}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-lg text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-poke-red hover:bg-poke-darkred text-white font-medium py-2.5 rounded-lg text-sm disabled:opacity-50"
            >
              {submitting ? 'Confirmando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};