"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HomeIcon, 
  CalendarDaysIcon, 
  TrophyIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolidIcon,
  CalendarDaysIcon as CalendarSolidIcon,
  TrophyIcon as TrophySolidIcon
} from "@heroicons/react/24/solid";

const navigationItems = [
  {
    href: "/",
    label: "Today",
    icon: HomeIcon,
    activeIcon: HomeSolidIcon,
    description: "Today's matches"
  },
  {
    href: "/matches",
    label: "Fixtures",
    icon: CalendarDaysIcon,
    activeIcon: CalendarSolidIcon,
    description: "All fixtures"
  },
  {
    href: "/leagues",
    label: "Leagues",
    icon: TrophyIcon,
    activeIcon: TrophySolidIcon,
    description: "League standings"
  }
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button - Fixed Position */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/25 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <XMarkIcon className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bars3Icon className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 rounded-t-2xl z-50 lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6">
                {/* Handle */}
                <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
                
                {/* Navigation Items */}
                <nav className="space-y-2">
                  {navigationItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const IconComponent = isActive ? item.activeIcon : item.icon;
                    
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <IconComponent className="w-6 h-6" />
                          <div>
                            <div className="font-semibold">{item.label}</div>
                            <div className={`text-sm ${
                              isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-border/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    Swipe down to close
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Bottom Tab Bar for mobile (alternative approach)
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 z-40 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = isActive ? item.activeIcon : item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  className="w-1 h-1 bg-primary rounded-full"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
