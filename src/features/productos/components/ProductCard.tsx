import Link from 'next/link';
import { Producto } from '../domain/producto.types';

export const ProductCard = ({ producto }: { producto: Producto }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col hover:border-poke-red transition duration-200 group">
      <div className="h-48 overflow-hidden bg-slate-950 relative flex items-center justify-center p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 text-blue-300 border border-blue-500/30">
          {producto.categoria}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-white mb-1 line-clamp-1 group-hover:text-poke-gold transition">
          {producto.nombre}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">
          {producto.descripcion}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
          <span className="text-xl font-extrabold text-white">
            ${producto.precio.toFixed(2)}
          </span>
          <Link
            href={`/catalogo/${producto.id}`}
            className="text-sm bg-poke-red hover:bg-poke-darkred text-white font-medium px-4 py-2 rounded-lg transition"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};