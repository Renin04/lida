import { memo } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import ValueSection from '@/components/sections/ValueSection';
import AgentShowcase from '@/components/sections/AgentShowcase';
import HowItWorks from '@/components/sections/HowItWorks';
import Testimonials from '@/components/sections/Testimonials';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';

const HomePage = memo(function HomePage() {
  return (
    <>
      <HeroSection />
      <ValueSection />
      <AgentShowcase />
      <HowItWorks />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </>
  );
});

export default HomePage;
