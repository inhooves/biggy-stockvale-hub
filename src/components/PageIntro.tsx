import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import groceryBag from "@/assets/grocery-bag.png";

/**
 * PageIntro
 * A purple-themed intro that plays on every route change.
 * Recreates the "drop, squash, bounce & settle" 3D grocery bag
 * animation from the reference video — built with framer-motion.
 * Pure UX layer; does not modify any underlying page content.
 */
export function PageIntro() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(true);
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
    setShow(true);
    const t = setTimeout(() => setShow(false), 1900);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key={key}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-center overflow-hidden"
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

          {/* Soft floor glow where the bag lands */}
          <div className="absolute inset-x-0 bottom-[18%] flex justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 0.6, 1.4, 1.1, 1.25],
                opacity: [0, 0, 0.7, 0.4, 0.5],
              }}
              transition={{
                duration: 1.6,
                times: [0, 0.35, 0.42, 0.6, 1],
                ease: "easeOut",
              }}
              className="h-40 w-[420px] rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse, hsl(var(--accent) / 0.7) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Bag wrapper handles vertical drop & bounce */}
          <motion.div
            initial={{ y: "-110vh" }}
            animate={{
              // drop -> impact -> bounce up -> small bounce -> settle
              y: ["-110vh", "0vh", "-22vh", "0vh", "-7vh", "0vh"],
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.42, 0.62, 0.78, 0.9, 1],
              ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn"],
            }}
            className="relative mb-[12vh] will-change-transform"
            style={{ transformOrigin: "bottom center" }}
          >
            {/* Squash & stretch wrapper (independent scale on impact) */}
            <motion.div
              initial={{ scaleX: 0.92, scaleY: 1.08 }}
              animate={{
                scaleX: [0.92, 0.92, 1.25, 1.0, 1.08, 1.0, 1.04, 1.0],
                scaleY: [1.08, 1.08, 0.7, 1.05, 0.85, 1.02, 0.95, 1.0],
              }}
              transition={{
                duration: 1.5,
                times: [0, 0.4, 0.45, 0.62, 0.66, 0.82, 0.92, 1],
                ease: "easeOut",
              }}
              style={{ transformOrigin: "bottom center" }}
            >
              <img
                src={groceryBag}
                alt=""
                className="h-[55vh] max-h-[520px] w-auto object-contain select-none"
                style={{
                  filter:
                    "drop-shadow(0 24px 40px hsl(245 60% 8% / 0.6)) drop-shadow(0 0 30px hsl(var(--primary) / 0.5))",
                }}
                draggable={false}
              />
            </motion.div>

            {/* Ground contact shadow — compresses on impact */}
            <motion.div
              initial={{ scaleX: 0.3, opacity: 0 }}
              animate={{
                scaleX: [0.3, 0.3, 1.4, 0.7, 1.1, 0.85, 1.0],
                opacity: [0, 0, 0.6, 0.35, 0.5, 0.4, 0.45],
              }}
              transition={{
                duration: 1.5,
                times: [0, 0.4, 0.45, 0.62, 0.7, 0.85, 1],
                ease: "easeOut",
              }}
              className="absolute left-1/2 -bottom-3 h-4 w-[60%] -translate-x-1/2 rounded-full blur-lg"
              style={{ background: "hsl(245 70% 5% / 0.7)" }}
            />
          </motion.div>

          {/* Burst particles on impact */}
          {[...Array(14)].map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const dist = 160 + (i % 3) * 40;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 0, 1, 0],
                  scale: [0, 0, 1, 0.6],
                  x: [0, 0, Math.cos(angle) * dist, Math.cos(angle) * dist * 1.2],
                  y: [
                    0,
                    0,
                    Math.sin(angle) * dist * 0.4,
                    Math.sin(angle) * dist * 0.4 + 60,
                  ],
                }}
                transition={{
                  duration: 1.2,
                  times: [0, 0.42, 0.62, 1],
                  ease: "easeOut",
                }}
                className="absolute bottom-[22%] left-1/2 h-2.5 w-2.5 rounded-full"
                style={{
                  background:
                    i % 3 === 0
                      ? "hsl(var(--accent))"
                      : i % 3 === 1
                      ? "hsl(38 95% 60%)"
                      : "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 12px hsl(var(--accent) / 0.8)",
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
