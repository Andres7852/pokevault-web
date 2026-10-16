'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductoService } from '../../features/productos/services/producto.service';
import { Producto, PaginationMeta } from '../../features/productos/domain/producto.types';
import { ProductCard } from '../../features/productos/components/ProductCard';

const CATEGORIAS = [
  { id: 'todos', label: 'Todos' },
  { id: 'tcg-boxes', label: 'Cajas TCG' },
  { id: 'psa-cards', label: 'Cartas PSA' },
  { id: 'consolas', label: 'Consolas' },
  { id: 'juegos', label: 'Juegos' },
  { id: 'peluches', label: 'Peluches' },
];

function CatalogoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 6, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const categoria = searchParams.get('categoria') || 'todos';
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await ProductoService.getAll({ page, limit: 6, categoria, search });
        setProductos(res.data);
        setPagination(res.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, categoria, search]);

  const updateFilters = (newCat?: string, newPage?: number, newSearch?: string) => {
    const params = new URLSearchParams();
    const finalCat = newCat !== undefined ? newCat : categoria;
    const finalPage = newPage !== undefined ? newPage : 1;
    const finalSearch = newSearch !== undefined ? newSearch : search;

    if (finalCat && finalCat !== 'todos') params.set('categoria', finalCat);
    if (finalPage > 1) params.set('page', finalPage.toString());
    if (finalSearch) params.set('search', finalSearch);

    router.push(`/catalogo?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white">Catálogo PokéVault</h1>
        <p className="text-slate-400 mt-2">Explora cartas originales, cajas TCG selladas y artículos de colección.</p>
      </div>

      {/* Buscador */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar cartas, cajas, consolas..."
          className="flex-grow bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-poke-red"
        />
        <button
          onClick={() => updateFilters(undefined, 1, searchTerm)}
          className="bg-poke-red hover:bg-poke-darkred text-white font-medium px-6 py-2.5 rounded-lg transition"
        >
          Buscar
        </button>
      </div>

      {/* Categorías */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateFilters(cat.id, 1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              categoria === cat.id
                ? 'bg-poke-red text-white'
                : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Cargando productos de PokéVault...</div>
      ) : productos.length === 0 ? (
        <div className="text-center py-20 bg-slate-800 border border-slate-700 rounded-xl">
          <p className="text-slate-300 text-lg">No se encontraron productos con estos filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {productos.map((prod) => (
            <ProductCard key={prod.id} producto={prod} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            disabled={pagination.page <= 1}
            onClick={() => updateFilters(undefined, pagination.page - 1)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-30 text-white"
          >
            Anterior
          </button>
          <span className="text-slate-400 text-sm">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => updateFilters(undefined, pagination.page + 1)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-30 text-white"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white">Cargando catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}