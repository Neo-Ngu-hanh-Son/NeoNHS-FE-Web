import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export function AnimatedCounter({ value, className = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateValue();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  function animateValue() {
    const numericMatch = value.match(/^([\d.]+)/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const target = parseFloat(numericMatch[1]);
    const suffix = value.slice(numericMatch[1].length);
    const isDecimal = numericMatch[1].includes('.');
    const duration = 1500;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (isDecimal) {
        setDisplayValue(current.toFixed(1) + suffix);
      } else {
        setDisplayValue(Math.floor(current).toLocaleString() + suffix);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    }

    requestAnimationFrame(tick);
  }

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
