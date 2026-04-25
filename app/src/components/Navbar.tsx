import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const navLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/about', label: 'nav.about' },
  { path: '/agents', label: 'nav.agents' },
  { path: '/pricing', label: 'nav.pricing' },
  { path: '/contact', label: 'nav.contact' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-black">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/lida-logo.png"
              alt="LIDA"
              className="w-8 h-8 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="font-pixel text-sm tracking-tight">LIDA</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-pixel text-[10px] uppercase tracking-wider relative transition-opacity hover:opacity-70 ${
                  isActive(link.path) ? 'opacity-100' : 'opacity-60'
                }`}
              >
                {t(link.label)}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side: Language + Login */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center border-2 border-black rounded font-pixel text-[10px] overflow-hidden"
            >
              <span
                className={`px-2 py-1 ${
                  language === 'en' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                {t('common.en')}
              </span>
              <span
                className={`px-2 py-1 ${
                  language === 'fa' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                {t('common.fa')}
              </span>
            </button>

            <Link
              to="/login"
              className="hidden sm:inline-flex btn-primary py-2 px-4 text-[10px]"
            >
              {t('nav.login')}
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 border-2 border-black rounded"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[45] bg-white">
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-12">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
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
                aria-label="Close menu"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`font-pixel text-lg ${
                    isActive(link.path) ? 'text-black' : 'text-black/50'
                  }`}
                >
                  {t(link.label)}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-primary text-center mt-4"
              >
                {t('nav.login')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
