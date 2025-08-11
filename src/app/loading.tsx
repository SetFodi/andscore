export default function Loading() {
  return (
    <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute left-0 right-0 top-1/3 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-lg" />
      </div>
      <div className="kick-scene">
        <div className="kick-player" />
        <div className="kick-ball" />
        <div className="kick-trail" />
        <div className="kick-net" />
      </div>
    </div>
  );
}


