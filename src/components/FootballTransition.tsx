"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function Ball() {
  return (
    <div className="football-ball">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} aria-hidden>
        <circle cx="12" cy="12" r="10" fill="#ffffff" stroke="#cbd5e1" />
        <path d="M12 7l2.2 1.6-.8 2.5H10.6l-.8-2.5L12 7zM8.7 12.2l1.9 1.4-.7 2.3L7.8 16l-.9-2.2 1.8-1.6zM15.3 12.2l1.8 1.6-.9 2.2-2.1-.1-.7-2.3 1.9-1.4z" fill="#475569" />
      </svg>
    </div>
  );
}

export default function FootballTransition() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setRolling(true);
      const t = setTimeout(() => setRolling(false), 1100);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      {rolling && (
        <div className="football-roller">
          <Ball />
        </div>
      )}
    </div>
  );
}


