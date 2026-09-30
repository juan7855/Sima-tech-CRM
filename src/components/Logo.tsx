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

/**
 * Escenario del logo para portadas. Todas las capas comparten el mismo centro:
 * halo de luz, anillo con cometa orbital, anillo punteado contra-rotante y el
 * logo flotando en el medio, así nada queda desalineado.
 */
export function LogoHero({ size = 280, className = "" }: { size?: number; className?: string }) {
  const stage = size * 1.5;
  const sweepMask =
    "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))";
  return (
    <div className={className} style={{ width: stage, height: stage }} aria-hidden>
      <div className="relative h-full w-full">
      {/* Halo de luz */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: stage * 1.9,
          height: stage * 1.9,
          background:
            "radial-gradient(closest-side, rgba(255,122,24,0.30), rgba(255,122,24,0.10) 45%, transparent 72%)",
        }}
        animate={{ opacity: [0.65, 1, 0.65], scale: [0.97, 1.03, 0.97] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Anillo de referencia fijo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ember-400/20"
        style={{ width: size * 1.22, height: size * 1.22 }}
      />

      {/* Cometa orbital */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 1.22,
          height: size * 1.22,
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 230deg, rgba(255,162,58,0.0) 235deg, rgba(255,162,58,0.95) 359deg, transparent 360deg)",
          maskImage: sweepMask,
          WebkitMaskImage: sweepMask,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      {/* Anillo punteado exterior, gira al revés */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.09]"
        style={{ width: size * 1.46, height: size * 1.46 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />

      {/* Satélite sobre el anillo exterior */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ width: 0, height: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <span
          className="absolute rounded-full bg-ember-300"
          style={{
            width: 7,
            height: 7,
            left: -3.5,
            top: -(size * 1.46) / 2 - 3.5,
            boxShadow: "0 0 14px 3px rgba(255,162,58,0.7)",
          }}
        />
      </motion.div>

      {/* Logo */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ marginLeft: -size / 2, marginTop: -size / 2 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <LogoMark size={size} glow={false} />
      </motion.div>
      </div>
    </div>
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
