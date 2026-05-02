import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import groceryBag from "@/assets/grocery-bag.png";

/**
 * PageIntro
 * Zip-reveal transition: a half-sized grocery bag slides smoothly from the
 * top of the screen to the bottom while two purple panels split apart like
 * a zipper, revealing the destination page underneath.
 * Pure UX overlay; never blocks interaction (pointer-events-none).
 */
export function PageIntro() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(true);
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
    setShow(true);
    const t = setTimeout(() => setShow(false), 1700);
    return () => clearTimeout(t);
  }, [pathname]);

  // Shared duration & easing so panels and bag stay perfectly in sync
  const DURATION = 1.5;
  const EASE = [0.65, 0, 0.35, 1] as const;

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key={key}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* LEFT purple panel — zips open by sliding leftward */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: DURATION, ease: EASE }}
            className="absolute inset-y-0 left-0 w-1/2"
            style={{
              background:
                "linear-gradient(120deg, hsl(245 60% 14%) 0%, hsl(var(--primary) / 0.95) 60%, hsl(245 50% 22%) 100%)",
              boxShadow:
                "inset -1px 0 0 hsl(var(--accent) / 0.6), inset -8px 0 24px hsl(var(--primary) / 0.5)",
            }}
          />

          {/* RIGHT purple panel — zips open by sliding rightward */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: DURATION, ease: EASE }}
            className="absolute inset-y-0 right-0 w-1/2"
            style={{
              background:
                "linear-gradient(-120deg, hsl(245 60% 14%) 0%, hsl(var(--primary) / 0.95) 60%, hsl(245 50% 22%) 100%)",
              boxShadow:
                "inset 1px 0 0 hsl(var(--accent) / 0.6), inset 8px 0 24px hsl(var(--primary) / 0.5)",
            }}
          />

          {/* Glowing seam line — the "zipper teeth" — fades as it splits */}
          <motion.div
            initial={{ opacity: 0.9, scaleY: 1 }}
            animate={{ opacity: [0.9, 0.7, 0], scaleY: [1, 1, 0.6] }}
            transition={{ duration: DURATION, ease: "easeInOut", times: [0, 0.6, 1] }}
            className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2"
            style={{
              background:
                "linear-gradient(to bottom, transparent, hsl(var(--accent)) 20%, hsl(var(--primary-foreground)) 50%, hsl(var(--accent)) 80%, transparent)",
              boxShadow:
                "0 0 12px hsl(var(--accent) / 0.9), 0 0 24px hsl(var(--primary) / 0.7)",
            }}
          />

          {/* Bag wrapper — slides smoothly from above the viewport to below */}
          <motion.div
            initial={{ y: "-25vh", x: "-50%", rotate: -2 }}
            animate={{
              y: ["-25vh", "40vh", "115vh"],
              rotate: [-2, 2, -1],
              x: ["-50%", "-48%", "-50%"],
            }}
            transition={{
              duration: DURATION,
              ease: EASE,
              times: [0, 0.5, 1],
            }}
            className="absolute left-1/2 top-0 will-change-transform"
            style={{ transformOrigin: "center center" }}
          >
            <img
              src={groceryBag}
              alt=""
              className="h-[28vh] max-h-[260px] w-auto object-contain select-none"
              style={{
                filter:
                  "drop-shadow(0 18px 28px hsl(245 70% 6% / 0.65)) drop-shadow(0 0 24px hsl(var(--primary) / 0.7)) drop-shadow(0 0 8px hsl(var(--accent) / 0.4))",
              }}
              draggable={false}
            />
          </motion.div>

          {/* Sparkle trail behind the bag */}
          {[...Array(6)].map((_, i) => {
            const delay = 0.08 + i * 0.07;
            const offsetX = (i % 2 === 0 ? -1 : 1) * (12 + (i % 3) * 8);
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0, y: "-20vh", x: `calc(-50% + ${offsetX}px)` }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.4],
                  y: ["-20vh", "50vh", "110vh"],
                }}
                transition={{
                  duration: DURATION - delay,
                  delay,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                }}
                className="absolute left-1/2 top-0 h-1.5 w-1.5 rounded-full"
                style={{
                  background:
                    i % 3 === 0
                      ? "hsl(var(--accent))"
                      : i % 3 === 1
                      ? "hsl(38 95% 65%)"
                      : "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 10px hsl(var(--accent) / 0.9)",
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PageIntro;
