"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function FootballTransition() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-16 flex items-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Enhanced Football with trail effect */}
          <motion.div
            className="relative"
            initial={{ x: -100 }}
            animate={{ x: window.innerWidth + 100 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {/* Motion trail */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 left-0 h-0.5 w-12 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
            
            {/* Football with actual image */}
            <motion.div
              className="relative w-10 h-10"
              animate={{
                rotate: 720
              }}
              transition={{
                duration: 0.8,
                ease: "linear"
              }}
            >
              <Image
                src="/football.png"
                alt="Football"
                width={40}
                height={40}
                className="w-full h-full drop-shadow-xl"
              />
            </motion.div>
            
            {/* Speed lines for dramatic effect */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 h-px bg-primary/40"
                style={{
                  left: -20 - (i * 10),
                  width: 8 + (i * 4)
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 0] }}
                transition={{
                  duration: 0.4,
                  delay: 0.15 + (i * 0.05)
                }}
              />
            ))}
          </motion.div>
          
          {/* Top progress line */}
          <motion.div
            className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-transparent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
