import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Inicio', icon: '🏠' },
  { path: '/recipes/v60', label: 'Recetas', icon: '📖' },
  { path: '/calculator', label: 'Calculadora', icon: '🧮' },
  { path: '/history', label: 'Historial', icon: '📋' },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  const isHandsFree = useUIStore((s) => s.isHandsFree);

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Hands‑free mode: render children without chrome
  if (isHandsFree) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-svh bg-coffee-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-coffee-primary text-white px-4 py-3 flex items-center justify-between shadow-md">
        <h1 className="text-lg font-bold tracking-wide">Coffee Companion</h1>
        <Link
          to="/settings"
          className="text-xl hover:text-coffee-bg transition-colors"
          aria-label="Configuración"
        >
          ⚙️
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-coffee-primary-light/20 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <ul className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path} className="flex-1">
                <Link
                  to={item.path}
                  className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors ${
                    active
                      ? 'text-coffee-primary'
                      : 'text-coffee-muted/60 hover:text-coffee-muted'
                  }`}
                >
                  <span className="text-xl leading-none">{item.icon}</span>
                  <span className={`text-[10px] leading-tight ${
                    active ? 'font-semibold' : 'font-medium'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
