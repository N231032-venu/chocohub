import React from 'react';
import { Sparkles, ShieldCheck, Heart, Leaf, Award, Clock } from 'lucide-react';

export default function UspSection() {
  const usps = [
    {
      icon: Sparkles,
      title: 'Zero Refined Sugar',
      description: 'Sweetened solely with organic Medjool dates, raw wild honey, and coconut palm jaggery. Zero sugar crash.',
    },
    {
      icon: ShieldCheck,
      title: '100% Preservative Free',
      description: 'No hydrogenated vegetable oils, no artificial flavors, and no chemical emulsifiers or palm oil.',
    },
    {
      icon: Heart,
      title: '70–80% Single Origin Cocoa',
      description: 'Ethically sourced, single-origin South Indian and Belgian cocoa rich in flavonoids & magnesium.',
    },
    {
      icon: Clock,
      title: 'Freshly Made on Order',
      description: 'Crafted in small micro-batches in our Bangalore home kitchen right after you place your order.',
    },
  ];

  return (
    <section id="why-us" className="py-16 sm:py-20 bg-card border-y border-truffle/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="px-3 py-1 rounded-full bg-cream-100 text-truffle-dark text-xs font-bold uppercase tracking-wider border border-truffle/20">
            Why Happy Choco?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cocoa-dark">
            Pure Indulgence. Honest Ingredients.
          </h2>
          <p className="text-sm text-cocoa-muted leading-relaxed font-light">
            We believe you shouldn't have to compromise on health to satisfy your chocolate cravings. Here is how we make our chocolates different from commercial bars.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {usps.map((usp, index) => {
            const Icon = usp.icon;
            return (
              <div
                key={index}
                className="bg-[#FFFBF5] rounded-24 p-6 sm:p-7 border border-truffle/15 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col items-center text-center space-y-3.5 group hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center text-cocoa-dark group-hover:scale-110 transition-transform duration-200 border border-truffle/15 shadow-inner">
                  <Icon className="w-7 h-7 stroke-[1.75]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-cocoa-dark">
                  {usp.title}
                </h3>
                <p className="text-xs text-cocoa-muted leading-relaxed font-light">
                  {usp.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
