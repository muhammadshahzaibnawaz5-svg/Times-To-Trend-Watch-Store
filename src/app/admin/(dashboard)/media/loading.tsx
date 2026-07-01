export default function MediaLoading() {
  return (
    <div className="space-y-6">
      {' '}
      <div className="bg-muted h-9 w-48 animate-pulse rounded" />{' '}
      <div className="grid grid-cols-4 gap-4">
        {' '}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-muted aspect-square animate-pulse rounded-lg" />
        ))}{' '}
      </div>{' '}
    </div>
  );
}
