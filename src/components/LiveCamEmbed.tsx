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
    ja: 'ライブカメラ準備中',
    zh: '直播摄像头准备中',
    en: 'Live cam coming soon'
  },
  awaitingHint: {
    ja: 'YouTube配信IDが登録されるとここに映像が表示されます。',
    zh: 'YouTube 视频 ID 登记后这里会显示直播画面。',
    en: 'Video will appear here once a YouTube stream ID is registered.'
  }
} as const;

function camName(cam: CamProps, locale: Locale): string {
  if (locale === 'ja') return cam.nameJa;
  if (locale === 'zh') return cam.nameZh ?? cam.nameJa;
  return cam.nameEn;
}

export function LiveCamEmbed({
  cam,
  locale
}: {
  cam: CamProps;
  locale: Locale;
}) {
  const src = cam.youtubeVideoId
    ? `https://www.youtube.com/embed/${cam.youtubeVideoId}?autoplay=1&mute=1&rel=0`
    : cam.youtubeChannelId
      ? `https://www.youtube.com/embed/live_stream?channel=${cam.youtubeChannelId}&autoplay=1&mute=1`
      : null;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300">
        {camName(cam, locale)}
      </div>
      <div className="aspect-video bg-black">
        {src ? (
          <iframe
            src={src}
            title={camName(cam, locale)}
            className="h-full w-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-zinc-500">
            <span className="text-xs uppercase tracking-widest text-zinc-600">
              {T.awaiting[locale]}
            </span>
            <span className="max-w-xs px-6 text-xs leading-relaxed text-zinc-600">
              {T.awaitingHint[locale]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
