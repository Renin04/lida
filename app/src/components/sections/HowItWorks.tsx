import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const steps = [
  {
    key: 'step1',
    numberKey: 'howItWorks.step1.number',
    titleKey: 'howItWorks.step1.title',
    bodyKey: 'howItWorks.step1.body',
    image: '/step-choose.png',
  },
  {
    key: 'step2',
    numberKey: 'howItWorks.step2.number',
    titleKey: 'howItWorks.step2.title',
    bodyKey: 'howItWorks.step2.body',
    image: '/step-connect.png',
  },
  {
    key: 'step3',
    numberKey: 'howItWorks.step3.number',
    titleKey: 'howItWorks.step3.title',
    bodyKey: 'howItWorks.step3.body',
    image: '/step-deploy.png',
  },
];

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function HowItWorks() {
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
          {t('howItWorks.label')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="font-pixel text-display mb-16"
        >
          {t('howItWorks.headline')}
        </motion.h2>

        {/* Steps */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              custom={i}
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex-1 relative"
            >
              {/* Step Number */}
              <div className="font-pixel text-[48px] text-black/20 mb-2 leading-none">
                {t(step.numberKey)}
              </div>

              {/* Pixel Illustration */}
              <div className="mb-4 w-[120px] h-[80px] flex items-center justify-center border-2 border-black/10 rounded bg-black/5">
                <img
                  src={step.image}
                  alt={t(step.titleKey)}
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              {/* Title */}
              <h3 className="font-pixel text-base mb-2">{t(step.titleKey)}</h3>

              {/* Body */}
              <p className="font-mono text-sm text-black/70">{t(step.bodyKey)}</p>

              {/* Arrow between steps (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-3 text-black/30 font-pixel text-xl">
                  &rarr;
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
