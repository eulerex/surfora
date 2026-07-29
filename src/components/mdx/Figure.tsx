type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
};

/**
 * Styled image for MDX articles: capped height so portrait shots don't
 * dominate, optional caption below. Images are self-hosted under /public.
 */
export function Figure({src, alt, caption}: FigureProps) {
  return (
    <figure className="my-7">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="max-h-[440px] w-full rounded-xl border border-line object-cover"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
