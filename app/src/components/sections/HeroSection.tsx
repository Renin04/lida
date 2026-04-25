import { useState, useEffect, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/*  PixelParticleField – isolated perpetual animation                   */
/* ------------------------------------------------------------------ */
interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

const PixelParticles = memo(function PixelParticles() {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 30,
      duration: 20 + Math.random() * 20,
      size: 2 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.2,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-white"
          style={{
            left: `${p.x}%`,
            bottom: '-4px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: var(--start-opacity, 0.2); }
          100% { transform: translateY(-110vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  TypewriterText                                                      */
/* ------------------------------------------------------------------ */
function TypewriterText({
  text,
  speed = 40,
  onComplete,
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < text.length) {
        setDisplayed(text.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayed}
      <span
        className={showCursor ? 'animate-blink' : 'opacity-0'}
        onAnimationEnd={() => setShowCursor((v) => !v)}
      >
        |
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ASCII LIDA Character                                                */
/* ------------------------------------------------------------------ */
const ASCII_LIDA = `
     .---.
    / o o \\
   |   <   |
    \\ - /
     '-'
    /| |\\
   / | | \\
     | |
    /   \\
   '     '
`;

const ASCIILIDA = memo(function ASCIILIDA() {
  return (
    <div className="animate-breathe hidden sm:block">
      <pre
        className="font-mono text-white/80 text-xs sm:text-sm leading-tight whitespace-pre select-none"
        style={{ fontFamily: 'monospace' }}
      >
        {ASCII_LIDA}
      </pre>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Hero Section                                                        */
/* ------------------------------------------------------------------ */
export default function HeroSection() {
  const { t } = useTranslation();
  const [, setHeadlineDone] = useState(false);
  const [subVisible, setSubVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [trustVisible, setTrustVisible] = useState(false);

  const handleHeadlineDone = useCallback(() => {
    setHeadlineDone(true);
    setTimeout(() => setSubVisible(true), 100);
    setTimeout(() => setCtaVisible(true), 400);
    setTimeout(() => setTrustVisible(true), 700);
  }, []);

  return (
    <section className="relative min-h-[100dvh] bg-black text-white overflow-hidden flex items-center">
      {/* Pixel Particles */}
      <PixelParticles />

      {/* Scanlines - more visible on dark bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-20 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column - Text */}
          <div className="flex-1 max-w-2xl">
            {/* Label */}
            <p
              className="font-pixel text-[10px] text-white/50 uppercase mb-6"
              style={{ letterSpacing: '0.2em' }}
            >
              {t('hero.label')}
            </p>

            {/* Headline with Typewriter */}
            <h1 className="font-pixel text-display-xl uppercase mb-6 min-h-[3em]">
              <TypewriterText
                text={t('hero.headline')}
                speed={40}
                onComplete={handleHeadlineDone}
              />
            </h1>

            {/* Subheadline */}
            <div
              className={`transition-all duration-300 ${
                subVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="font-mono text-base text-white/70 max-w-[480px] mb-8">
                {t('hero.subheadline')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-300 ${
                ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <Link
                to="/register"
                className="inline-flex items-center justify-center bg-white text-black border-2 border-white rounded-lg px-6 py-3 font-pixel text-xs uppercase hover:opacity-80 transition-opacity glitch-hover"
              >
                {t('hero.ctaPrimary')}
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center bg-transparent text-white border-2 border-white rounded-lg px-6 py-3 font-pixel text-xs uppercase hover:bg-white/10 transition-colors"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>

            {/* Trust Bar */}
            <div
              className={`transition-opacity duration-500 ${
                trustVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p className="font-mono text-xs text-white/40">
                {t('hero.trust')}
              </p>
              {/* Pixel placeholder logos */}
              <div className="flex gap-3 mt-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-white/20 border border-white/30"
                    style={{ borderRadius: '2px' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - ASCII Art */}
          <div className="flex-shrink-0 hidden lg:flex items-center justify-center">
            <div className="scale-in-animation">
              <ASCIILIDA />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
