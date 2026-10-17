import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 text-center border-b border-slate-800 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-widest text-poke-gold bg-slate-950 px-3.5 py-1.5 rounded-full border border-yellow-500/30">
            Coleccionismo Pokémon Oficial
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-6 mb-4">
            Bienvenido a <span className="text-poke-red">PokéVault</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Tu bóveda segura para conseguir cajas de sobres TCG, cartas graduadas PSA, videojuegos clásicos y consolas de edición limitada.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/catalogo"
              className="bg-poke-red hover:bg-poke-darkred text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-red-900/30"
            >
              Explorar Catálogo
            </Link>
            <Link
              href="/registro"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl border border-slate-700 transition"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="text-lg font-bold text-white mb-2">100% Auténtico</h3>
          <p className="text-slate-400 text-sm">Cada producto y carta sellada es verificada antes de entrar a la bóveda.</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <div className="text-3xl mb-3">📦</div>
          <h3 className="text-lg font-bold text-white mb-2">Envío Protegido</h3>
          <p className="text-slate-400 text-sm">Embalaje especial con protección rígida para que tus cartas lleguen en condición Gem Mint.</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <div className="text-3xl mb-3">⭐</div>
          <h3 className="text-lg font-bold text-white mb-2">Stock Exclusivo</h3>
          <p className="text-slate-400 text-sm">Acceso a piezas raras de TCG Scarlet & Violet, 151, Crown Zenith y gradaciones PSA.</p>
        </div>
      </section>
    </div>
  );
}