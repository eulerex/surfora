import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import '../globals.css';

const geistSans = Geist({variable: '--font-geist-sans', subsets: ['latin']});
const geistMono = Geist_Mono({variable: '--font-geist-mono', subsets: ['latin']});

const META_BY_LOCALE = {
  ja: {
    title: 'Surfora — 今日、日本のどこで乗る？',
    description:
      '日本各地のサーフスポットの今日の波と風、AIによる一言判断を並べて見比べられます。'
  },
  zh: {
    title: 'Surfora — 今天日本哪里适合冲浪？',
    description:
      '一览日本各地冲浪点今日的浪高、风况和 AI 一句话判断，帮你决定今天该去哪。'
  },
  en: {
    title: 'Surfora — Where to surf in Japan today?',
    description:
      "Today's waves, wind, and AI-written recommendations across Japan's surf spots, side by side."
  }
} as const;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const lc = (locale in META_BY_LOCALE ? locale : 'ja') as keyof typeof META_BY_LOCALE;
  const meta = META_BY_LOCALE[lc];
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      locale: lc === 'ja' ? 'ja_JP' : lc === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Surfora'
    },
    twitter: {
      card: 'summary',
      title: meta.title,
      description: meta.description
    }
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const lc = locale as 'ja' | 'zh' | 'en';

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-zinc-100">
        <NextIntlClientProvider>
          <Header locale={lc} />
          <div className="flex-1">{children}</div>
          <Footer locale={lc} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
