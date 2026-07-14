import Link from 'next/link';

type Locale = 'ja' | 'zh' | 'en';

export function SpotLink({
  slug,
  locale,
  children
}: {
  slug: string;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/${locale}/spots/${slug}`}
      className="text-ocean underline decoration-ocean/40 underline-offset-2 hover:decoration-ocean"
    >
      {children}
    </Link>
  );
}
