'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

export const RegisterForm = () => {
  const { register } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ nombre, email, password });
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-center text-white mb-6">Crear Cuenta en PokéVault</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-950/80 text-red-300 border border-red-500 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-300">Nombre Completo</label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2.5 border rounded-lg bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-poke-red outline-none"
            placeholder="Ash Ketchum"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-300">Correo Electrónico</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 border rounded-lg bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-poke-red outline-none"
            placeholder="entrenador@pokevault.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-300">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 border rounded-lg bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-poke-red outline-none"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-poke-red hover:bg-poke-darkred text-white py-3 rounded-lg font-bold shadow transition disabled:opacity-50"
        >
          {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-400">
        ¿Ya tienes cuenta? <Link href="/login" className="text-poke-gold font-bold hover:underline">Inicia sesión</Link>
      </p>
    </div>
  );
};