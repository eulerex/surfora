export function YouTube({id, title}: {id: string; title?: string}) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-line bg-navy">
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
          title={title ?? `YouTube video ${id}`}
          className="h-full w-full"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
