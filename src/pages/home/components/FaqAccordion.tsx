import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqAccordionProps {
  items: { q: string; a: string }[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'border-emerald-200 dark:border-emerald-500/30 shadow-md'
                : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
            }`}
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-[15px] pr-4">
                {item.q}
              </span>
              <span
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isOpen
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
              <div>
                <p className="px-5 pb-5 text-slate-500 dark:text-slate-400 leading-relaxed text-[15px]">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
