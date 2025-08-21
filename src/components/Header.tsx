"use client";
import Link from "next/link";
import { ANDSCORE_BRAND_NAME } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";
import LogoAndscore from "./LogoAndscore";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import {
  HomeIcon,
  CalendarDaysIcon,
  TrophyIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      href: "/",
      label: "Today",
      icon: HomeIcon,
      description: "Today's matches"
    },
    {
      href: "/matches",
      label: "Fixtures",
      icon: CalendarDaysIcon,
      description: "All fixtures"
    },
    {
      href: "/leagues",
      label: "Leagues",
      icon: TrophyIcon,
      description: "League standings"
    },
    {
      href: "https://www.football-data.org/",
      label: "Data",
      icon: ChartBarIcon,
      description: "Data source",
      external: true
    }
  ];

  return (
    <motion.header
      className="sticky top-0 z-50 glass-card border-b border-border/50 backdrop-blur-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <LogoAndscore />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300"
                  >
                    <IconComponent className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>{item.label}</span>

                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <Badge variant="league" className="text-xs">
                Live Scores
              </Badge>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg glass-card border border-border/50 hover:border-primary/50 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className="lg:hidden overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <nav className="py-4 space-y-2 border-t border-border/50">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-300"
                >
                  <IconComponent className="w-5 h-5" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
}


