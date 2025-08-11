export default function GradientBackdrops() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Primary gradient orb */}
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-gradient-from/30 via-gradient-via/20 to-transparent blur-3xl animate-pulse" />
      
      {/* Secondary gradient orb */}
      <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-gradient-to/30 via-gradient-via/20 to-transparent blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      {/* Tertiary accent orb */}
      <div className="absolute top-1/2 left-[-100px] h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-gradient-to-r from-gradient-via/20 to-transparent blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_80%)]" />
    </div>
  );
}


