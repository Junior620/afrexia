'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export interface FAQItem {
  question: string;
  answer: string;
}

interface QualityFAQProps {
  title: string;
  items: FAQItem[];
}

export function QualityFAQ({ title, items }: QualityFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#0F1814]">
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fade">
          <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-12 text-center">
            {title}
          </h2>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto space-y-4">
          {items.map((item, index) => (
            <ScrollReveal
              key={index}
              animation="slide-up"
              delay={index * 0.05}
            >
              <div className="bg-[#0A1410] rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] transition-all duration-300 overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#4A9A62] focus:ring-offset-2 focus:ring-offset-[#0A1410] rounded-xl"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-lg font-semibold text-[#E8F5E9] pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#4A9A62] flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-[#C5D9C0] leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
