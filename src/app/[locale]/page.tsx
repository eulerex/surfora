import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {Link} from '@/i18n/navigation';

export default async function Home({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <HomeContent currentLocale={locale} />;
}

function HomeContent({currentLocale}: {currentLocale: string}) {
  const t = useTranslations('Home');

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-light tracking-[0.2em] sm:text-5xl">
        SURFORA
      </h1>
      <p className="mt-4 text-sm text-zinc-400">{t('tagline')}</p>

      <nav className="mt-16 flex gap-4 text-xs uppercase tracking-widest text-zinc-500">
        {routing.locales.map((locale) => (
          <Link
            key={locale}
            href="/"
            locale={locale}
            className={
              locale === currentLocale
                ? 'text-zinc-100 underline underline-offset-4'
                : 'hover:text-zinc-300'
            }
          >
            {locale}
          </Link>
        ))}
      </nav>
    </main>
  );
}
