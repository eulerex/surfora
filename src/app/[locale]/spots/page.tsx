import {redirect} from 'next/navigation';

export default async function SpotsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  redirect(`/${locale}#spots`);
}
