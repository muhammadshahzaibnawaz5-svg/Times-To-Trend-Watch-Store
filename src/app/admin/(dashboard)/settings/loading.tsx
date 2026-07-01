export default function SettingsLoading() {
  return (
    <div className="space-y-4">
      {' '}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-muted h-24 animate-pulse rounded-lg" />
      ))}{' '}
    </div>
  );
}
