export default function GradientBackdrops() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.35),transparent_60%)] blur-2xl" />
      <div className="absolute bottom-[-160px] right-[-80px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.35),transparent_60%)] blur-2xl" />
    </div>
  );
}


