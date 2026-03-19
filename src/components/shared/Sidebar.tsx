'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Heart, Home, BarChart3, Pill, FileText, Calendar,
  ClipboardList, Settings, LogOut
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Evolução', icon: BarChart3 },
  { href: '/medications', label: 'Medicamentos', icon: Pill },
  { href: '/exams', label: 'Exames', icon: FileText },
  { href: '/appointments', label: 'Consultas', icon: Calendar },
  { href: '/reports', label: 'Relatórios', icon: ClipboardList },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

interface SidebarProps {
  userName: string;
  avatarUrl?: string | null;
}

export function Sidebar({ userName, avatarUrl }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside
      className="hidden md:flex flex-col w-64 h-full border-r shrink-0"
      style={{ background: 'var(--surface)', borderColor: 'var(--border-light)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
          }}
        >
          <Heart className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-lg font-bold gradient-text">VitaLog</h1>
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Diário de Saúde
          </p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? 'rgba(13, 148, 136, 0.08)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--muted)',
              }}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
              {item.label}
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--primary)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-center gap-3 px-3 mb-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              {getInitials(userName)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
              {userName}
            </p>
            <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
              Pro · 14 dias restantes
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all cursor-pointer"
          style={{ color: 'var(--muted)' }}
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </aside>
  );
}
