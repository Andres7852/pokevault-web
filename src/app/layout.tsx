import './globals.css';
import { AuthProvider } from '../features/auth/hooks/useAuth';
import { Navbar } from '../features/common/components/Navbar';
import { Footer } from '../features/common/components/Footer';

export const metadata = {
  title: 'PokéVault — Tienda Full-Stack de Coleccionables Pokémon',
  description: 'Catálogo oficial, consolas retro, cartas PSA y figuras exclusivas de Pokémon',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-900 text-slate-100" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}