'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductoService } from '../../../features/productos/services/producto.service';
import { Producto } from '../../../features/productos/domain/producto.types';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { PedidoForm } from '../../../features/pedidos/components/PedidoForm';

export default function ProductoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    ProductoService.getById(parseInt(id as string))
      .then(setProducto)
      .catch(() => router.push('/catalogo'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div className="text-center py-20 text-white">Cargando detalles...</div>;
  if (!producto) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 bg-slate-950 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="max-h-96 object-contain"
          />
        </div>

        <div className="p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 text-blue-300 border border-blue-500/30">
              {producto.categoria}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-4 mb-2">
              {producto.nombre}
            </h1>
            <p className="text-2xl font-bold text-poke-gold mb-6">
              ${producto.precio.toFixed(2)}
            </p>
            <p className="text-slate-300 leading-relaxed text-sm mb-6">
              {producto.descripcion}
            </p>
          </div>

          <div>
            {orderSuccess ? (
              <div className="bg-green-950/60 border border-green-500 text-green-300 p-4 rounded-xl text-center">
                🎉 ¡Pedido realizado con éxito! Puedes revisarlo en{' '}
                <button
                  onClick={() => router.push('/mis-pedidos')}
                  className="underline font-bold text-white ml-1"
                >
                  Mis Pedidos
                </button>
              </div>
            ) : user ? (
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-poke-red hover:bg-poke-darkred text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-900/30"
              >
                Comprar / Realizar Pedido
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3.5 rounded-xl transition"
              >
                Inicia Sesión para Comprar
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <PedidoForm
          producto={producto}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setOrderSuccess(true);
          }}
        />
      )}
    </div>
  );
}