"use client";
import Link from "next/link";

export default function LogoAndscore() {
  return (
    <Link href="/" className="font-extrabold text-xl tracking-tight" style={{ fontFamily: "var(--font-brand)" }}>
      <span className="gradient-text">AndScore</span>
    </Link>
  );
}


