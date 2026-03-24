'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Pill, ClipboardList, Settings } from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Evolução', icon: BarChart3 },
  { href: '/medications', label: 'Remédios', icon: Pill },
  { href: '/reports', label: 'Relatórios', icon: ClipboardList },
  { href: '/settings', label: 'Config', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden z-50 glass"
      style={{
        borderTop: '1px solid var(--border-light)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around py-2">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/home'
              ? pathname === '/home'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
              style={{
                color: isActive ? 'var(--primary)' : 'var(--muted)',
              }}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
