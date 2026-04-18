import {
  Download,
  Map,
  Ticket,
  Sparkles,
  Globe,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

const iconMap: Record<string, ComponentType<LucideProps>> = {
  Download,
  Map,
  Ticket,
  Sparkles,
  Globe,
};

export function IconByName({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}
