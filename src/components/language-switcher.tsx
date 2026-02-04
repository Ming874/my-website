"use client"

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'zh' : 'en';
    router.replace(pathname, { locale: nextLocale, scroll: false });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
      aria-label="Switch language"
    >
      <Languages className="h-5 w-5" />
      <span className="text-sm font-medium uppercase">{locale}</span>
    </button>
  );
}
