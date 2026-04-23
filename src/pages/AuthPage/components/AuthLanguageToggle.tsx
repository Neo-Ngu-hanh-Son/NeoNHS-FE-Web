import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { useAuthLocale } from '../i18n/AuthLocaleContext'

export function AuthLanguageToggle() {
  const { locale, toggleLocale, t } = useAuthLocale()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-2 rounded-lg border-slate-200 bg-white/80 text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
      onClick={toggleLocale}
      title={locale === 'vi' ? t('lang.useEnglish') : t('lang.useVietnamese')}
      aria-label={locale === 'vi' ? t('lang.useEnglish') : t('lang.useVietnamese')}
    >
      <Globe className="size-4 shrink-0" aria-hidden />
      <span className="text-xs font-semibold tabular-nums">{locale === 'vi' ? 'EN' : 'VI'}</span>
      <span className="sr-only">{t('lang.sr')}</span>
    </Button>
  )
}
