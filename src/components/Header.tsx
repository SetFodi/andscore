import Link from "next/link";
import { ANDSCORE_BRAND_NAME } from "@/lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-black/30 border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          <span className="bg-gradient-to-r from-indigo-500 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
            {ANDSCORE_BRAND_NAME}
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-foreground/70">
          <Link href="/" className="hover:text-foreground">Today</Link>
          <Link href="/leagues" className="hover:text-foreground">Leagues</Link>
          <a href="https://www.football-data.org/" target="_blank" rel="noreferrer" className="hover:text-foreground">Data</a>
        </nav>
      </div>
    </header>
  );
}


