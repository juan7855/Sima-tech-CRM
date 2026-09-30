import { motion } from "motion/react";

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      whileHover={{ scale: 1.06, rotate: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      aria-hidden
    >
      <defs>
        <linearGradient id="lg-a" x1="4" y1="2" x2="34" y2="38">
          <stop offset="0%" stopColor="#FFC07A" />
          <stop offset="55%" stopColor="#FF8A2B" />
          <stop offset="100%" stopColor="#EF5F04" />
        </linearGradient>
        <linearGradient id="lg-b" x1="12" y1="10" x2="30" y2="32">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path
        d="M20 1.6c1.1 0 2.1.6 2.7 1.5l12.4 20.6c1.7 2.8-.4 6.3-3.6 6.3H8.5c-3.2 0-5.3-3.5-3.6-6.3L17.3 3.1C17.9 2.2 18.9 1.6 20 1.6Z"
        fill="url(#lg-a)"
      />
      <path
        d="M16.6 14.4 26 20.2a1.5 1.5 0 0 1 0 2.6l-9.4 5.8a1.5 1.5 0 0 1-2.2-1.3V15.7a1.5 1.5 0 0 1 2.2-1.3Z"
        fill="url(#lg-b)"
      />
    </motion.svg>
  );
}

export function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark />
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
