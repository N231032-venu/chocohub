'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do you sweeten your chocolates without refined white sugar?',
      answer:
        'We use natural whole-food sweeteners depending on the variant: organic Arabian Medjool dates, unprocessed raw wild honey, organic coconut palm jaggery, or zero-calorie monk fruit extract. None of our products contain refined table sugar, high-fructose corn syrup, or artificial artificial sweeteners like aspartame.',
    },
    {
      question: 'What is the shelf life of Happy Choco homemade chocolates?',
      answer:
        'Because our chocolates contain zero artificial chemical preservatives, they are best enjoyed within 45 to 60 days. Keep them in a cool, dry place away from direct sunlight (or in a refrigerator in airtight containers during warmer summer months).',
    },
    {
      question: 'How does Bangalore delivery work and how fresh is the batch?',
      answer:
        'Every single order is handcrafted in our Bangalore home kitchen fresh upon receiving your order. For Bangalore deliveries, orders are prepared within 24 hours and delivered via hyper-local courier. Pan-India shipping takes 2-4 business days with insulated packaging.',
    },
    {
      question: 'Are these chocolates safe for children and diabetic individuals?',
      answer:
        'Yes! Parents love giving our chocolates to toddlers and school kids because there is zero refined sugar rush or artificial colors. For diabetic individuals, we recommend our "Hazelnut Praline Date Cups" and "80% Sugar-Free Espresso Cocoa Thins" sweetened with monk fruit.',
    },
    {
      question: 'Can I order directly on WhatsApp or customize my box?',
      answer:
        'Yes! You can order directly through our website checkout or click the "Order on WhatsApp" button (+91 9845368540) to request custom flavor combinations, personalized handwritten greeting cards, or bulk party favors.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#FFFBF5] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="px-3 py-1 rounded-full bg-card text-truffle-dark text-xs font-bold uppercase tracking-wider border border-truffle/20">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cocoa-dark">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FDF0E6] rounded-24 border border-truffle/15 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-bold text-cocoa-dark"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-truffle transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-cocoa-dark' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-cocoa-muted font-light leading-relaxed border-t border-truffle/10 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
