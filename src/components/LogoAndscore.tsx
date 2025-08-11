"use client";
import Link from "next/link";

function Ball({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="inline-block align-sub rotate-0 group-hover:rotate-45 transition-transform duration-300"
      aria-hidden
    >
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#g)" stroke="#cbd5e1" />
      <path d="M12 7l2.2 1.6-.8 2.5H10.6l-.8-2.5L12 7zM8.7 12.2l1.9 1.4-.7 2.3L7.8 16l-.9-2.2 1.8-1.6zM15.3 12.2l1.8 1.6-.9 2.2-2.1-.1-.7-2.3 1.9-1.4z" fill="#475569" />
    </svg>
  );
}

export default function LogoAndscore() {
  return (
    <Link href="/" className="group flex items-center gap-2 font-extrabold text-xl tracking-tight">
      <span className="gradient-text">andsc</span>
      <Ball />
      <span className="gradient-text">re</span>
    </Link>
  );
}


