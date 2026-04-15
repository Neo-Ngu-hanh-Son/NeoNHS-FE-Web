import { Star, MessageCircle } from 'lucide-react';
import type { Testimonial } from '../homepage-data';

interface TestimonialCardProps {
  testimonial: Testimonial;
  variant?: 'featured' | 'compact';
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} trên 5 sao`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-600'
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialCard({ testimonial, variant = 'compact' }: TestimonialCardProps) {
  const t = testimonial;

  if (variant === 'featured') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-8 testimonial-card shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full font-medium">
              Việt Nam
            </span>
          </div>
          <StarRating rating={t.rating} />
          <p className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed mt-4 mb-6">
            {t.quote}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 text-xs ${t.highlightBg} ${t.highlightText} px-3 py-1.5 rounded-full font-medium`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${t.highlightDot}`} />
            {t.highlight}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
          <div
            className={`w-10 h-10 rounded-full ${t.avatarBg} text-white flex items-center justify-center text-sm font-bold`}
          >
            {t.avatar}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.name}</p>
            <p className="text-xs text-slate-400">{t.location}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-7 testimonial-card shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-full ${t.avatarBg} text-white flex items-center justify-center text-xs font-bold`}
        >
          {t.avatar}
        </div>
        <StarRating rating={t.rating} />
      </div>
      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">{t.quote}</p>
      <span
        className={`inline-flex items-center gap-1.5 text-xs ${t.highlightBg} ${t.highlightText} px-3 py-1.5 rounded-full font-medium`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${t.highlightDot}`} />
        {t.highlight}
      </span>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.name}</p>
        <span className="text-xs text-slate-400">
          &bull; {t.role}
        </span>
      </div>
    </div>
  );
}
