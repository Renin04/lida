import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const agents = [
  {
    key: 'crm',
    icon: '/agent-crm.png',
    nameKey: 'agents.crm.name',
    descKey: 'agents.crm.desc',
    priceKey: 'agents.crm.price',
  },
  {
    key: 'hr',
    icon: '/agent-hr.png',
    nameKey: 'agents.hr.name',
    descKey: 'agents.hr.desc',
    priceKey: 'agents.hr.price',
  },
  {
    key: 'finance',
    icon: '/agent-finance.png',
    nameKey: 'agents.finance.name',
    descKey: 'agents.finance.desc',
    priceKey: 'agents.finance.price',
  },
  {
    key: 'marketing',
    icon: '/agent-marketing.png',
    nameKey: 'agents.marketing.name',
    descKey: 'agents.marketing.desc',
    priceKey: 'agents.marketing.price',
  },
  {
    key: 'support',
    icon: '/agent-support.png',
    nameKey: 'agents.support.name',
    descKey: 'agents.support.desc',
    priceKey: 'agents.support.price',
  },
  {
    key: 'dev',
    icon: '/agent-dev.png',
    nameKey: 'agents.dev.name',
    descKey: 'agents.dev.desc',
    priceKey: 'agents.dev.price',
  },
  {
    key: 'analytics',
    icon: '/agent-analytics.png',
    nameKey: 'agents.analytics.name',
    descKey: 'agents.analytics.desc',
    priceKey: 'agents.analytics.price',
  },
  {
    key: 'legal',
    icon: '/agent-legal.png',
    nameKey: 'agents.legal.name',
    descKey: 'agents.legal.desc',
    priceKey: 'agents.legal.price',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function AgentShowcase() {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="font-pixel text-xs text-black/50 uppercase mb-4"
        >
          {t('agents.label')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="font-pixel text-display mb-4"
        >
          {t('agents.headline')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="font-mono text-base text-black/70 mb-12 max-w-[600px]"
        >
          {t('agents.subtext')}
        </motion.p>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.key}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              whileHover={{
                y: -4,
                transition: { duration: 0.15 },
              }}
              className="pixel-border p-6 bg-white group cursor-pointer glitch-hover"
            >
              {/* Agent Icon */}
              <div className="flex justify-center mb-4">
                <img
                  src={agent.icon}
                  alt={t(agent.nameKey)}
                  className="w-16 h-16 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              {/* Agent Name */}
              <h3 className="font-pixel text-sm uppercase mb-2 text-center">
                {t(agent.nameKey)}
              </h3>

              {/* Description */}
              <p className="font-mono text-[13px] text-black/60 text-center line-clamp-2 mb-4">
                {t(agent.descKey)}
              </p>

              {/* Price + CTA */}
              <div className="flex items-center justify-between mt-auto">
                <span className="font-mono font-bold text-base">
                  {t(agent.priceKey)}
                </span>
                <Link
                  to="/register"
                  className="bg-black text-white font-pixel text-[10px] px-3 py-2 rounded hover:opacity-80 transition-opacity"
                >
                  {t('agents.cta')} &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
