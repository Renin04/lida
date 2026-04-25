import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-black text-white py-24 overflow-hidden">
      {/* Sparse pixel particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-white"
            style={{
              left: `${10 + Math.random() * 80}%`,
              bottom: '-4px',
              width: `${2 + Math.random() * 2}px`,
              height: `${2 + Math.random() * 2}px`,
              opacity: 0.1 + Math.random() * 0.15,
              animation: `floatUp ${25 + Math.random() * 20}s linear ${Math.random() * 20}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)',
        }}
      />

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="font-pixel text-2xl sm:text-display mb-6"
        >
          {t('cta.headline')}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-mono text-base text-white/60 mb-8"
        >
          {t('cta.subtext')}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/register"
            className="inline-flex items-center justify-center bg-white text-black border-2 border-white rounded-lg px-8 py-4 font-pixel text-sm uppercase animate-pulse-scale hover:opacity-90 transition-opacity glitch-hover"
          >
            {t('cta.button')}
          </Link>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="font-mono text-xs text-white/40 mt-6"
        >
          {t('cta.note')}
        </motion.p>
      </div>

      {/* LIDA peeking from bottom-right */}
      <motion.div
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          delay: 0.3,
        }}
        className="absolute bottom-0 right-12 hidden lg:block"
      >
        <img
          src="/lida-wave.png"
          alt="LIDA"
          className="w-24 h-24 object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
      </motion.div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: var(--start-opacity, 0.15); }
          100% { transform: translateY(-110vh); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
