import type { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  action?: ReactNode;
}

export default function DashboardLayout({ children, title, action }: DashboardLayoutProps) {
  return (
    <div className="min-h-[100dvh] flex bg-black/5">
      <DashboardSidebar />

      {/* Main content area */}
      <main
        className="flex-1 min-w-0"
        style={{
          marginLeft: 0,
        }}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-[40] bg-white/95 backdrop-blur-sm border-b-2 border-black px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <h1 className="font-pixel text-sm sm:text-base uppercase tracking-tight">{title}</h1>
          {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
