import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  const productLinks = [
    { label: 'footer.links.features', path: '/agents' },
    { label: 'footer.links.agents', path: '/agents' },
    { label: 'footer.links.pricing', path: '/pricing' },
    { label: 'footer.links.integrations', path: '/dashboard/settings' },
  ];

  const companyLinks = [
    { label: 'footer.links.about', path: '/about' },
    { label: 'footer.links.blog', path: '#' },
    { label: 'footer.links.careers', path: '#' },
    { label: 'footer.links.contact', path: '/contact' },
  ];

  const resourceLinks = [
    { label: 'footer.links.docs', path: '#' },
    { label: 'footer.links.api', path: '#' },
    { label: 'footer.links.status', path: '#' },
  ];

  const legalLinks = [
    { label: 'footer.links.terms', path: '#' },
    { label: 'footer.links.privacy', path: '#' },
    { label: 'footer.links.cookies', path: '#' },
  ];

  return (
    <footer className="bg-black text-white border-t-2 border-white relative overflow-hidden">
      {/* Scanline overlay at 10% opacity */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-16 relative z-10">
        {/* Large Logo */}
        <div className="flex justify-center mb-12">
          <img
            src="/lida-logo.png"
            alt="LIDA"
            className="w-16 h-16 object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Product */}
          <div>
            <h4 className="font-pixel text-xs mb-4">{t('footer.product')}</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="font-mono text-sm text-white/70 hover:text-white/40 transition-opacity"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-pixel text-xs mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="font-mono text-sm text-white/70 hover:text-white/40 transition-opacity"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-pixel text-xs mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="font-mono text-sm text-white/70 hover:text-white/40 transition-opacity"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-pixel text-xs mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="font-mono text-sm text-white/70 hover:text-white/40 transition-opacity"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="font-pixel text-[10px] text-white/50 tracking-wider">
            &copy; {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
