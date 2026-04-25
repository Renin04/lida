import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const testimonials = [
  {
    key: 'q1',
    textKey: 'testimonials.quotes.q1.text',
    authorKey: 'testimonials.quotes.q1.author',
    roleKey: 'testimonials.quotes.q1.role',
    logo: '/testimonial-logo-1.png',
  },
  {
    key: 'q2',
    textKey: 'testimonials.quotes.q2.text',
    authorKey: 'testimonials.quotes.q2.author',
    roleKey: 'testimonials.quotes.q2.role',
    logo: '/testimonial-logo-2.png',
  },
  {
    key: 'q3',
    textKey: 'testimonials.quotes.q3.text',
    authorKey: 'testimonials.quotes.q3.author',
    roleKey: 'testimonials.quotes.q3.role',
    logo: '/testimonial-logo-3.png',
  },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="font-pixel text-xs text-black/50 uppercase mb-4"
        >
          {t('testimonials.label')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="font-pixel text-display mb-12"
        >
          {t('testimonials.headline')}
        </motion.h2>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((quote, i) => (
            <motion.div
              key={quote.key}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{
                boxShadow: '0 0 0 2px #000',
                transition: { duration: 0.15 },
              }}
              className="pixel-border p-6 bg-white glitch-hover"
            >
              {/* Quote Mark */}
              <div className="font-pixel text-[48px] text-black/20 leading-none mb-2 select-none">
                &ldquo;
              </div>

              {/* Quote Text */}
              <p className="font-mono text-sm italic mb-6">{t(quote.textKey)}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={quote.logo}
                  alt=""
                  className="w-8 h-8 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div>
                  <p className="font-mono font-bold text-sm">{t(quote.authorKey)}</p>
                  <p className="font-mono text-xs text-black/50">{t(quote.roleKey)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
