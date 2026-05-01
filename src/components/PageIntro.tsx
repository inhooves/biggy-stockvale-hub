import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import biggyLogo from "@/assets/biggy-logo.png";

/**
 * PageIntro
 * A short, purple-themed "drop & bounce" overlay that plays whenever the
 * route changes (i.e. when a user opens a new dashboard or page).
 * Pure UX layer — it does not modify any underlying page content.
 */
export function PageIntro() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(true);
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
    setShow(true);
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key={key}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          {/* Purple gradient backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, hsl(var(--primary) / 0.95) 0%, hsl(245 50% 18% / 0.98) 60%, hsl(245 60% 10% / 1) 100%)",
            }}
          />

          {/* Soft animated glow ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1.8], opacity: [0, 0.6, 0] }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.35 }}
            className="absolute h-64 w-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--accent) / 0.5) 0%, transparent 70%)",
            }}
          />

          {/* Drop & bounce logo */}
          <motion.div
            initial={{ y: -400, opacity: 0, rotate: -8, scale: 0.9 }}
            animate={{
              y: [-400, 0, -60, 0, -20, 0],
              opacity: [0, 1, 1, 1, 1, 1],
              rotate: [-8, 2, -1, 1, 0, 0],
              scale: [0.9, 1.05, 0.98, 1.02, 1, 1],
            }}
            transition={{
              duration: 1.1,
              times: [0, 0.45, 0.62, 0.78, 0.9, 1],
              ease: "easeOut",
            }}
            className="relative z-10"
          >
            <img
              src={biggyLogo}
              alt=""
              className="h-40 w-auto md:h-56 object-contain"
              style={{
                filter:
                  "drop-shadow(0 0 24px hsl(var(--accent) / 0.7)) drop-shadow(0 0 48px hsl(var(--primary) / 0.6))",
                mixBlendMode: "screen",
              }}
            />
            {/* Ground shadow that compresses on bounce */}
            <motion.div
              initial={{ scaleX: 0.4, opacity: 0 }}
              animate={{
                scaleX: [0.4, 1, 0.6, 0.95, 0.7, 0.85],
                opacity: [0, 0.5, 0.3, 0.5, 0.4, 0.45],
              }}
              transition={{
                duration: 1.1,
                times: [0, 0.45, 0.62, 0.78, 0.9, 1],
                ease: "easeOut",
              }}
              className="absolute left-1/2 -bottom-4 h-3 w-40 -translate-x-1/2 rounded-full blur-md"
              style={{ background: "hsl(var(--primary) / 0.6)" }}
            />
          </motion.div>

          {/* Sparkle particles */}
          {[...Array(10)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.cos((i / 10) * Math.PI * 2) * 140,
                y: Math.sin((i / 10) * Math.PI * 2) * 140,
              }}
              transition={{
                duration: 0.9,
                delay: 0.5 + i * 0.03,
                ease: "easeOut",
              }}
              className="absolute h-2 w-2 rounded-full"
              style={{
                background:
                  i % 2 === 0
                    ? "hsl(var(--accent))"
                    : "hsl(var(--primary-foreground))",
                boxShadow: "0 0 12px hsl(var(--accent) / 0.8)",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PageIntro;
