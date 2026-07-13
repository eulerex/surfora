type Locale = 'ja' | 'zh' | 'en';

type CamProps = {
  nameJa: string;
  nameEn: string;
  nameZh?: string | null;
  youtubeVideoId?: string | null;
  youtubeChannelId?: string | null;
};

const T = {
  awaiting: {
    ja: '準備中',
    zh: '准备中',
    en: 'Coming soon'
  },
  awaitingHint: {
    ja: 'ライブ配信のIDが登録され次第、ここに映像が表示されます。',
    zh: '直播 ID 登记后这里会显示画面。',
    en: 'Video will appear here once a stream ID is registered.'
  }
} as const;

function camName(cam: CamProps, locale: Locale): string {
  if (locale === 'ja') return cam.nameJa;
  if (locale === 'zh') return cam.nameZh ?? cam.nameJa;
  return cam.nameEn;
}

export function LiveCamEmbed({
  cam,
  locale,
  hideHeader
}: {
  cam: CamProps;
  locale: Locale;
  hideHeader?: boolean;
}) {
  const src = cam.youtubeVideoId
    ? `https://www.youtube.com/embed/${cam.youtubeVideoId}?autoplay=1&mute=1&rel=0`
    : cam.youtubeChannelId
      ? `https://www.youtube.com/embed/live_stream?channel=${cam.youtubeChannelId}&autoplay=1&mute=1`
      : null;

  const inner = src ? (
    <iframe
      src={src}
      title={camName(cam, locale)}
      className="h-full w-full"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ) : (
    <div className="flex h-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-[#0b2239] to-[#0e4d7a] text-center text-white/60">
      <span className="text-xs uppercase tracking-widest">
        {T.awaiting[locale]}
      </span>
      <span className="max-w-xs px-4 text-[11px] leading-relaxed text-white/45">
        {T.awaitingHint[locale]}
      </span>
    </div>
  );

  if (hideHeader) {
    return <div className="h-full w-full">{inner}</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="border-b border-line bg-sky-brand px-3 py-1.5 text-sm text-ocean">
        📹 {camName(cam, locale)}
      </div>
      <div className="aspect-video bg-navy">{inner}</div>
    </div>
  );
}
