"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-xl glass-card border border-border/50 flex items-center justify-center group overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label="Toggle theme"
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        animate={{
          background: theme === "light"
            ? "linear-gradient(135deg, rgba(245, 158, 11, 0.2), transparent)"
            : "linear-gradient(135deg, rgba(99, 102, 241, 0.2), transparent)"
        }}
      />

      <div className="relative">
        <AnimatePresence mode="wait">
          {theme === "light" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SunIcon className="h-5 w-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MoonIcon className="h-5 w-5 text-slate-400 group-hover:text-slate-300 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: theme === "light"
            ? "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)"
        }}
      />
    </motion.button>
  );
}
