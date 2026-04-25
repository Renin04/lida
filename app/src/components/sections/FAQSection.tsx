import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const faqItems = [
  { key: 'q1', questionKey: 'faq.q1.question', answerKey: 'faq.q1.answer' },
  { key: 'q2', questionKey: 'faq.q2.question', answerKey: 'faq.q2.answer' },
  { key: 'q3', questionKey: 'faq.q3.question', answerKey: 'faq.q3.answer' },
  { key: 'q4', questionKey: 'faq.q4.question', answerKey: 'faq.q4.answer' },
  { key: 'q5', questionKey: 'faq.q5.question', answerKey: 'faq.q5.answer' },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b-2 border-black">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
        aria-expanded={isOpen}
      >
        <span className="font-pixel text-[13px] pr-4">{question}</span>
        <span
          className="font-pixel text-lg transition-transform shrink-0"
          style={{
            transitionTimingFunction: 'steps(2)',
            transitionDuration: '200ms',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden"
        style={{
          maxHeight: isOpen ? '500px' : '0',
          transition: 'max-height 300ms steps(4)',
        }}
      >
        <p className="font-mono text-sm text-black/70 pb-4 pr-8">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="font-pixel text-xs text-black/50 uppercase mb-4"
        >
          {t('faq.label')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="font-pixel text-display mb-12"
        >
          {t('faq.headline')}
        </motion.h2>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {faqItems.map((item, i) => (
            <AccordionItem
              key={item.key}
              question={t(item.questionKey)}
              answer={t(item.answerKey)}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
