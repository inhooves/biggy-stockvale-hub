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
          {/* LEFT purple panel — zips open with a sculpted zipper edge */}
          <motion.div
            initial={{ x: 0, skewX: -1 }}
            animate={{ x: "-108%", skewX: -4 }}
            transition={{ duration: DURATION, ease: EASE }}
            className="absolute inset-y-0 left-0 w-[56vw]"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 91% 13%, 99% 27%, 88% 44%, 98% 62%, 90% 79%, 100% 100%, 0 100%)",
              background:
                "radial-gradient(circle at 88% 24%, hsl(var(--accent) / 0.28), transparent 24%), linear-gradient(125deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.96) 58%, hsl(var(--secondary)) 100%)",
              boxShadow:
                "inset -10px 0 28px hsl(var(--accent) / 0.28), inset -34px 0 70px hsl(var(--primary) / 0.45)",
            }}
          />

          {/* RIGHT purple panel — zips open with a sculpted zipper edge */}
          <motion.div
            initial={{ x: 0, skewX: 1 }}
            animate={{ x: "108%", skewX: 4 }}
            transition={{ duration: DURATION, ease: EASE }}
            className="absolute inset-y-0 right-0 w-[56vw]"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 79%, 2% 62%, 12% 44%, 1% 27%, 9% 13%)",
              background:
                "radial-gradient(circle at 12% 72%, hsl(var(--accent) / 0.28), transparent 25%), linear-gradient(-125deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.96) 58%, hsl(var(--secondary)) 100%)",
              boxShadow:
                "inset 10px 0 28px hsl(var(--accent) / 0.28), inset 34px 0 70px hsl(var(--primary) / 0.45)",
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
            initial={{ top: "-16vh", x: "-50%", rotate: -4, scale: 1.08, opacity: 1 }}
            animate={{
              top: ["-16vh", "30vh", "92vh"],
              rotate: [-4, 4, -2],
              x: ["-50%", "-45%", "-50%"],
              scale: [1.08, 1.14, 1.02],
            }}
            transition={{
              duration: DURATION,
              ease: EASE,
              times: [0, 0.5, 1],
            }}
            className="absolute left-1/2 z-[120] will-change-transform"
            style={{ transformOrigin: "center center" }}
          >
            <span
              className="absolute inset-0 -z-10 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, hsl(var(--accent) / 0.55) 0%, hsl(var(--primary) / 0.35) 42%, transparent 72%)",
                transform: "scale(1.2)",
              }}
            />
            <img
              src={groceryBag}
              alt=""
              className="h-[34vh] min-h-[168px] max-h-[300px] w-auto object-contain select-none"
              style={{
                filter:
                  "drop-shadow(0 24px 34px hsl(var(--background) / 0.82)) drop-shadow(0 0 28px hsl(var(--accent) / 0.82)) drop-shadow(0 0 18px hsl(var(--primary-foreground) / 0.55))",
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
