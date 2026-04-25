import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingLIDA from './FloatingLIDA';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showFloatingLIDA?: boolean;
}

export default function Layout({
  children,
  showFooter = true,
  showFloatingLIDA = true,
}: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Scanline Overlay */}
      <div className="scanline-overlay" />

      <Navbar />

      <main className="flex-1 pt-16">{children}</main>

      {showFooter && <Footer />}
      {showFloatingLIDA && <FloatingLIDA />}
    </div>
  );
}
