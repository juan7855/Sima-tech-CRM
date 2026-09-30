import { AnimatePresence, motion } from "motion/react";

const RING = "/brand/logo-ring.png";
const DISC = "/brand/logo-disc.png";

/**
 * Logo oficial de Sima Tech: el disco central permanece estático y el anillo
 * con los íconos de servicio gira lentamente detrás (más rápido al pasar el cursor).
 */
export function LogoMark({
  size = 40,
  spin = true,
  glow = true,
  className = "",
}: {
  size?: number;
  spin?: boolean;
  glow?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover="hover"
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      aria-hidden
    >
      {glow && (
        <motion.span
          className="pointer-events-none absolute inset-[-18%] rounded-full bg-ember-500/30 blur-xl"
          animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.img
        src={RING}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none"
        animate={spin ? { rotate: 360 } : undefined}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        variants={{ hover: { scale: 1.06 } }}
      />
      <motion.img
        src={DISC}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none"
        variants={{ hover: { scale: 1.04 } }}
      />
    </motion.div>
  );
}

export function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={collapsed ? 44 : 46} />
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="leading-none"
        >
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-white">
            Sima<span className="text-ember-400">Tech</span>
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">
            Command Center
          </p>
        </motion.div>
      )}
    </div>
  );
}

/** Logo grande para portadas: flota suavemente y el anillo orbita detrás del disco. */
export function LogoHero({ size = 320, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <LogoMark size={size} />
    </motion.div>
  );
}

/** Pantalla de carga inicial con el logo; se desmonta al terminar el desvanecimiento. */
export function Splash({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <LogoMark size={150} />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-[11px] uppercase tracking-[0.3em] text-white/40"
          >
            Sima Tech · Command Center
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
