'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { PedidoService } from '../../features/pedidos/services/pedido.service';
import { Pedido } from '../../features/pedidos/domain/pedido.types';

export default function MisPedidosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      PedidoService.getMisPedidos()
        .then(setPedidos)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="text-center py-20 text-white">Cargando tus pedidos...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white mb-2">Mis Pedidos</h1>
      <p className="text-slate-400 mb-8">Historial de solicitudes y compras realizadas en PokéVault.</p>

      {pedidos.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl text-center">
          <p className="text-slate-300">Aún no has realizado pedidos.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((p) => (
            <div key={p.id} className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.producto.imagen}
                  alt={p.producto.nombre}
                  className="w-16 h-16 object-contain bg-slate-950 p-1 rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-white">{p.producto.nombre}</h3>
                  <p className="text-xs text-slate-400">
                    Cantidad: {p.cantidad} • Fecha: {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-400 italic mt-1">&quot;{p.mensaje}&quot;</p>
                </div>
              </div>

              <div className="flex items-center gap-6 self-end md:self-auto">
                <span className="text-lg font-bold text-white">${p.total.toFixed(2)}</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    p.estado === 'ENTREGADO'
                      ? 'bg-green-950 text-green-300 border border-green-500/40'
                      : p.estado === 'ENVIADO'
                      ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                      : 'bg-yellow-950 text-yellow-300 border border-yellow-500/40'
                  }`}
                >
                  {p.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}