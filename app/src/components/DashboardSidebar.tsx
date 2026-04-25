import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Bot,
  ShoppingCart,
  MessageSquare,
  Users,
  CreditCard,
  Settings,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '@/store';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/agents', label: 'My Agents', icon: Bot },
  { path: '/dashboard/store', label: 'Agent Store', icon: ShoppingCart },
  { path: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { path: '/dashboard/team', label: 'Team', icon: Users },
  { path: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardSidebar() {
  const location = useLocation();
  const sidebarOpen = useAuthStore((state) => state.sidebarOpen);
  const toggleSidebar = useAuthStore((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const sidebarWidth = sidebarOpen ? 'w-60' : 'w-16';
  const desktopWidth = sidebarOpen ? 240 : 64;

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-[46] lg:hidden bg-white border-2 border-black rounded-lg p-2"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" strokeWidth={2.5} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[46] lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="fixed top-0 left-0 bottom-0 w-60 bg-white border-r-2 border-black z-[47] lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b-2 border-black">
              <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                <img
                  src="/lida-logo.png"
                  alt="LIDA"
                  className="w-8 h-8 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
                <span className="font-pixel text-sm">LIDA</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 border-2 border-black rounded"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg font-pixel text-[10px] uppercase transition-all ${
                      active
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-black/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {user && (
              <div className="px-4 py-4 border-t-2 border-black">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-white font-pixel text-[10px]">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-xs font-bold">{user.name}</p>
                    <p className="font-mono text-[10px] text-black/50">{user.role}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 bottom-0 ${sidebarWidth} bg-white border-r-2 border-black z-[45] flex-col transition-all duration-200 step4-transition`}
        style={{ transitionTimingFunction: 'steps(4)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b-2 border-black">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <img
              src="/lida-logo.png"
              alt="LIDA"
              className="w-8 h-8 object-contain shrink-0"
              style={{ imageRendering: 'pixelated' }}
            />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-pixel text-sm whitespace-nowrap overflow-hidden"
                >
                  LIDA
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-1 border border-black rounded hover:bg-black/5 shrink-0"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-200 ${!sidebarOpen ? 'rotate-180' : ''}`}
              style={{ transitionTimingFunction: 'steps(2)' }}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/5'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-pixel text-[10px] uppercase whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        {user && (
          <div className={`px-4 py-4 border-t-2 border-black ${!sidebarOpen ? 'flex justify-center' : ''}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center shrink-0">
                <span className="text-white font-pixel text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    <p className="font-mono text-xs font-bold">{user.name}</p>
                    <p className="font-mono text-[10px] text-black/50">{user.role}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </aside>

      {/* Spacer for desktop */}
      <div
        className="hidden lg:block shrink-0 transition-all duration-200 step4-transition"
        style={{ width: desktopWidth, minWidth: desktopWidth, transitionTimingFunction: 'steps(4)' }}
      />
    </>
  );
}
