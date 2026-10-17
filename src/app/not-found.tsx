import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-6xl mb-4">⚡</div>
      <h1 className="text-4xl font-extrabold text-white mb-2">404 — ¡Un Psyduck salvaje te bloqueó el paso!</h1>
      <p className="text-slate-400 max-w-md mb-6">
        La página que buscas no existe o fue movida a otra zona de la región.
      </p>
      <Link
        href="/catalogo"
        className="bg-poke-red hover:bg-poke-darkred text-white font-medium px-6 py-2.5 rounded-lg transition"
      >
        Volver al Catálogo
      </Link>
    </div>
  );
}