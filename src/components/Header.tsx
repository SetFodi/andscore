import Link from "next/link";
import { ANDSCORE_BRAND_NAME } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";
import LogoAndscore from "./LogoAndscore";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 glass-card border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <LogoAndscore />
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Today</Link>
            <Link href="/matches" className="hover:text-foreground transition-colors">Fixtures</Link>
            <Link href="/leagues" className="hover:text-foreground transition-colors">Leagues</Link>
            <a href="https://www.football-data.org/" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Data</a>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


