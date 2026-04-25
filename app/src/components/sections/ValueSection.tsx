import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Brain, Clock, BarChart3 } from 'lucide-react';

const cards = [
  {
    key: 'think',
    icon: Brain,
    labelKey: 'value.cards.think.label',
    titleKey: 'value.cards.think.title',
    bodyKey: 'value.cards.think.body',
  },
  {
    key: 'act',
    icon: Clock,
    labelKey: 'value.cards.act.label',
    titleKey: 'value.cards.act.title',
    bodyKey: 'value.cards.act.body',
  },
  {
    key: 'report',
    icon: BarChart3,
    labelKey: 'value.cards.report.label',
    titleKey: 'value.cards.report.title',
    bodyKey: 'value.cards.report.body',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function ValueSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-20">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="font-pixel text-xs text-black/50 uppercase text-center mb-4"
        >
          {t('value.label')}
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="font-pixel text-display text-center mb-4"
        >
          {t('value.headline')}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="font-mono text-base text-black/70 text-center max-w-[640px] mx-auto mb-12"
        >
          {t('value.subtext')}
        </motion.p>

        {/* Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="pixel-border p-6 bg-white hover:border-black transition-all"
              >
                {/* Icon */}
                <div className="w-12 h-12 border-2 border-black rounded p-2 mb-4 flex items-center justify-center">
                  <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>

                {/* Label */}
                <p className="font-pixel text-[10px] text-black/50 uppercase mb-2">
                  {t(card.labelKey)}
                </p>

                {/* Title */}
                <h3 className="font-pixel text-sm mb-3">{t(card.titleKey)}</h3>

                {/* Body */}
                <p className="font-mono text-sm text-black/70">{t(card.bodyKey)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
