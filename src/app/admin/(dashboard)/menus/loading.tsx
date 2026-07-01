export default function MenusLoading() {
  return (
    <div className="space-y-6">
      {' '}
      <div className="bg-muted h-9 w-48 animate-pulse rounded" />{' '}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {' '}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted h-32 animate-pulse rounded-lg" />
        ))}{' '}
      </div>{' '}
    </div>
  );
}
