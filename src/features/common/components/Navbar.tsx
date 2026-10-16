'use client';

import Link from 'next/link';
import { useAuth } from '../../auth/hooks/useAuth';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-poke-red flex items-center justify-center border-2 border-white shadow">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            Poké<span className="text-poke-red">Vault</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/catalogo" className="text-slate-300 hover:text-white transition font-medium">
            Catálogo
          </Link>

          {user && (
            <Link href="/mis-pedidos" className="text-slate-300 hover:text-white transition font-medium">
              Mis Pedidos
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin" className="text-poke-gold hover:text-yellow-300 font-semibold transition flex items-center gap-1">
              ⭐ Administración
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 border border-slate-700 px-2.5 py-1 rounded-full bg-slate-800">
                {user.nombre} ({user.role})
              </span>
              <button
                onClick={logout}
                className="text-xs bg-slate-800 hover:bg-red-900/60 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-slate-300 hover:text-white px-3 py-1.5">
                Entrar
              </Link>
              <Link
                href="/registro"
                className="text-sm bg-poke-red hover:bg-poke-darkred text-white font-medium px-3.5 py-1.5 rounded-lg transition"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};