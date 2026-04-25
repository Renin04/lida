import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, HelpCircle, FileQuestion, X } from 'lucide-react';

const FloatingLIDA = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (!menuOpen) setTooltipVisible(true);
  }, [menuOpen]);

  const handleMouseLeave = useCallback(() => {
    setTooltipVisible(false);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden md:block">
      {/* Quick Action Menu */}
      {menuOpen && (
        <div className="absolute bottom-full right-0 mb-3 bg-white border-2 border-black rounded-lg p-3 shadow-lg min-w-[160px]">
          <div className="flex justify-between items-center mb-2">
            <span className="font-pixel text-[10px]">Quick Actions</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1 hover:bg-black/5 rounded"
              aria-label="Close menu"
            >
              <X className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </div>
          <div className="space-y-1">
            <button className="flex items-center gap-2 w-full px-2 py-1.5 font-mono text-xs hover:bg-black/5 rounded transition-colors text-left">
              <MessageCircle className="w-3 h-3" strokeWidth={2.5} />
              Chat
            </button>
            <button className="flex items-center gap-2 w-full px-2 py-1.5 font-mono text-xs hover:bg-black/5 rounded transition-colors text-left">
              <HelpCircle className="w-3 h-3" strokeWidth={2.5} />
              Help
            </button>
            <button className="flex items-center gap-2 w-full px-2 py-1.5 font-mono text-xs hover:bg-black/5 rounded transition-colors text-left">
              <FileQuestion className="w-3 h-3" strokeWidth={2.5} />
              FAQ
            </button>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltipVisible && !menuOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-black text-white px-3 py-1.5 rounded font-pixel text-[10px] whitespace-nowrap">
          {t('footer.floatingTooltip')}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
        </div>
      )}

      {/* LIDA Character */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="animate-float focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-lg"
        aria-label="Open LIDA assistant"
      >
        <img
          src="/lida-idle.png"
          alt="LIDA"
          className="w-20 h-20 object-contain drop-shadow-lg"
          style={{ imageRendering: 'pixelated' }}
        />
      </button>
    </div>
  );
};

export default FloatingLIDA;
