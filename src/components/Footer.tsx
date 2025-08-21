"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/solid";
import { InstagramIcon, LinkedInIcon, GitHubIcon, PortfolioIcon } from "./icons/SocialIcons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/fartenadzeluka/",
      icon: InstagramIcon,
      color: "hover:text-pink-500 hover:shadow-pink-500/25"
    },
    {
      name: "Portfolio",
      url: "https://lukapartenadze.vercel.app",
      icon: PortfolioIcon,
      color: "hover:text-blue-500 hover:shadow-blue-500/25"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/luka-partenadze-394675348/",
      icon: LinkedInIcon,
      color: "hover:text-blue-600 hover:shadow-blue-600/25"
    },
    {
      name: "GitHub",
      url: "https://github.com/SetFodi",
      icon: GitHubIcon,
      color: "hover:text-gray-300 hover:shadow-gray-300/25"
    }
  ];

  const footballEmojis = ["⚽", "🏆", "🥅", "👟", "🏟️"];
  const fixedPositions = [80, 120, 160, 200, 240]; // Fixed Y positions to avoid hydration mismatch

  return (
    <footer className="relative mt-20 border-t border-border/50 bg-gradient-to-b from-background to-background/50 backdrop-blur-xl overflow-hidden">
      {/* Animated Football Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {footballEmojis.map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl opacity-10 select-none"
            initial={{
              x: -50,
              y: fixedPositions[index],
              rotate: 0
            }}
            animate={{
              x: 1200,
              rotate: 360
            }}
            transition={{
              duration: 15 + index * 2,
              repeat: Infinity,
              ease: "linear",
              delay: index * 3
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Left: Made with passion */}
          <motion.div 
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-lg">Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <HeartIcon className="w-5 h-5 text-red-500" />
              </motion.div>
              <span className="text-lg">for football lovers</span>
              <motion.span
                className="text-xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                ⚽
              </motion.span>
            </div>
            <p className="text-sm text-muted-foreground">
              Bringing you closer to the beautiful game
            </p>
          </motion.div>

          {/* Center: Copyright */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-muted-foreground mb-2">
              © {currentYear} AndScore
            </p>
            <p className="text-sm font-medium">
              Made by{" "}
              <Link 
                href="https://lukapartenadze.vercel.app" 
                target="_blank"
                className="text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                Luka Partenadze
              </Link>
            </p>
          </motion.div>

          {/* Right: Social Links */}
          <motion.div 
            className="flex justify-center md:justify-end gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {socialLinks.map((link, index) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-12 h-12 rounded-full glass-card border border-border/50 transition-all duration-300 ${link.color} hover:border-primary/50 hover:shadow-xl backdrop-blur-sm`}
                  title={link.name}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <link.icon className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom: API Credits */}
        <motion.div 
          className="mt-8 pt-6 border-t border-border/30 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-xs text-muted-foreground">
            Football data powered by{" "}
            <Link 
              href="https://www.football-data.org" 
              target="_blank"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Football-Data.org
            </Link>
            {" "}• Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
