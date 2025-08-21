import type { LeagueCode } from "@/lib/constants";

type IconProps = { size?: number; color?: string; className?: string };

function Svg({ children, size = 24, className }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function CrownBall({ size, className }: IconProps) {
  // Premier League-inspired crown + ball glyph (original stylized)
  return (
    <Svg size={size} className={className}>
      <path d="M5 8l2.5-2 2.5 2 2.5-2 2.5 2 2.5-2V9.5c0 1.933-1.567 3.5-3.5 3.5H8.5C6.567 13 5 11.433 5 9.5V8z" />
      <circle cx="12" cy="17" r="4" fill="currentColor" />
      <path d="M12 14.6a2.4 2.4 0 012.4 2.4H9.6A2.4 2.4 0 0112 14.6z" fill="#00000022" />
    </Svg>
  );
}

function SwirlRing({ size, className }: IconProps) {
  // LaLiga-inspired swirl ring (original stylized)
  return (
    <Svg size={size} className={className}>
      <g>
        <path d="M12 2a10 10 0 100 20 10 10 0 100-20zm0 2a8 8 0 110 16 8 8 0 110-16z" opacity="0.35" />
        <path d="M20 12a8 8 0 00-8-8v3a5 5 0 015 5h3z" />
      </g>
    </Svg>
  );
}

function StylizedA({ size, className }: IconProps) {
  // Serie A-inspired angular "A"
  return (
    <Svg size={size} className={className}>
      <path d="M11.3 3.2a1 1 0 011.4 0l6.2 6.2a1 1 0 01-.7 1.7H15L12 20l-3-8.9H5.8a1 1 0 01-.7-1.7l6.2-6.2z" />
      <path d="M12 9l1.2 2.8h-2.4L12 9z" fill="#00000022" />
    </Svg>
  );
}

function Kicker({ size, className }: IconProps) {
  // Bundesliga-inspired kicker silhouette (minimal)
  return (
    <Svg size={size} className={className}>
      <path d="M5 5h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" opacity="0.15" />
      <circle cx="10" cy="8" r="2" />
      <path d="M8 14l2.5-3 2 1.2 1.5 2.8H12l-2 2H8l1.2-2H8z" />
      <circle cx="16.5" cy="16.5" r="1.2" />
    </Svg>
  );
}

function HexRing({ size, className }: IconProps) {
  // Ligue 1-inspired hex ring
  return (
    <Svg size={size} className={className}>
      <path d="M12 2l6 3.5v7L12 16l-6-3.5v-7L12 2z" opacity="0.25" />
      <path d="M12 5l3.5 2v4L12 13l-3.5-2V7L12 5z" />
    </Svg>
  );
}

function StarBall({ size, className }: IconProps) {
  // UCL-inspired star ball
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="9" opacity="0.15" />
      <path d="M12 6l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L6.2 10l4-.6L12 6z" />
    </Svg>
  );
}

export function LeagueIcon({ code, size = 22, className }: { code: LeagueCode; size?: number; color?: string; className?: string }) {
  switch (code) {
    case "PL":
      return <CrownBall size={size} className={className} />;
    case "PD":
      return <SwirlRing size={size} className={className} />;
    case "SA":
      return <StylizedA size={size} className={className} />;
    case "BL1":
      return <Kicker size={size} className={className} />;
    case "FL1":
      return <HexRing size={size} className={className} />;
    case "CL":
      return <StarBall size={size} className={className} />;
    default:
      return (
        <Svg size={size} className={className}>
          <circle cx="12" cy="12" r="10" opacity="0.15" />
        </Svg>
      );
  }
}


