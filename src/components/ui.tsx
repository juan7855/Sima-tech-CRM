import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionStyle,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

/* ------------------------------------------------------------------ */
/*  Contenedor con foco de luz que sigue al cursor (Fitts + feedback)  */
/* ------------------------------------------------------------------ */

type SpotlightProps = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

export function SpotlightCard({
  children,
  className,
  glow = true,
  delay = 0,
  as = "div",
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={reduce ? undefined : { y: -3 }}
      className={cn(
        "spotlight group relative overflow-hidden rounded-3xl",
        glow ? "glass" : "rounded-3xl border border-white/5 bg-white/[0.02]",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/*  Encabezado de sección                                             */
/* ------------------------------------------------------------------ */

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ember-400/90"
        >
          <span className="h-1 w-1 rounded-full bg-ember-500 shadow-[0_0_12px_2px_rgba(255,122,24,0.8)]" />
          {eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[34px]"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-[15px] leading-relaxed text-white/50"
          >
            {description}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Etiqueta / chip                                                    */
/* ------------------------------------------------------------------ */

export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "ember" | "signal" | "mint" | "violet";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "border-white/10 bg-white/5 text-white/60",
    ember: "border-ember-500/30 bg-ember-500/10 text-ember-300",
    signal: "border-signal-500/30 bg-signal-500/10 text-signal-400",
    mint: "border-mint-400/30 bg-mint-400/10 text-mint-400",
    violet: "border-violet-soft/30 bg-violet-soft/10 text-violet-soft",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Barra de progreso                                                  */
/* ------------------------------------------------------------------ */

export function ProgressBar({
  value,
  tone = "ember",
  className,
  showTrack = true,
}: {
  value: number;
  tone?: "ember" | "signal" | "mint";
  className?: string;
  showTrack?: boolean;
}) {
  const reduce = useReducedMotion();
  const fills: Record<string, string> = {
    ember: "from-ember-400 to-ember-600",
    signal: "from-signal-400 to-signal-500",
    mint: "from-mint-400 to-mint-400",
  };
  return (
    <div
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full",
        showTrack && "bg-white/[0.07]",
        className,
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: reduce ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
          fills[tone],
        )}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Anillo de progreso                                                 */
/* ------------------------------------------------------------------ */

export function ProgressRing({
  value,
  size = 92,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  label?: string;
  sublabel?: string;
}) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const reduce = useReducedMotion();
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-${label ?? "r"}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFC07A" />
            <stop offset="100%" stopColor="#EF5F04" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#ring-${label ?? "r"})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * Math.min(100, value)) / 100 }}
          transition={{ duration: reduce ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[17px] font-semibold tracking-tight text-white">{label}</span>
        {sublabel && <span className="text-[10px] text-white/40">{sublabel}</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Contador animado                                                   */
/* ------------------------------------------------------------------ */

export function Counter({
  to,
  decimals = 0,
  className,
  suffix = "",
}: {
  to: number;
  decimals?: number;
  className?: string;
  suffix?: string;
}) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, reduce]);

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString("es-ES", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Botón principal (magnético, estilo Apple)                          */
/* ------------------------------------------------------------------ */

export function PrimaryButton({
  children,
  onClick,
  className,
  type = "button",
  icon: Icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });
  const template = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0)`;

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform: template } as MotionStyle}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-ember-400 to-ember-600 px-5 py-2.5 text-[13px] font-semibold text-black shadow-[0_10px_30px_-10px_rgba(255,122,24,0.7)] transition-shadow hover:shadow-[0_14px_44px_-8px_rgba(255,122,24,0.85)]",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50" />
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon size={15} />}
        {children}
      </span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Botón fantasma                                                     */
/* ------------------------------------------------------------------ */

export function GhostButton({
  children,
  onClick,
  className,
  icon: Icon,
  active,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  active?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-300",
        active
          ? "border-ember-500/40 bg-ember-500/10 text-ember-300"
          : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white",
        className,
      )}
    >
      {Icon && <Icon size={15} />}
      {children}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Fondo ambiental (glow + rejilla)                                   */
/* ------------------------------------------------------------------ */

export function AmbientBackground({ intensity = 1 }: { intensity?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink-950" />
      <div
        className="absolute left-1/2 top-[-28%] h-[70vh] w-[120vw] -translate-x-1/2 rounded-full opacity-70 blur-[120px]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255,122,24,0.30) 0%, rgba(255,122,24,0.08) 45%, transparent 72%)",
          transform: `translate(-50%,0) scale(${intensity})`,
        }}
      />
      <div className="absolute inset-0 grid-floor opacity-70" />
      <div className="absolute inset-0 noise opacity-[0.035] mix-blend-overlay" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Separador                                                          */
/* ------------------------------------------------------------------ */

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-white/[0.06]", className)} />;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-white/5", className)} />;
}

export function FocusRing({ style }: { style?: CSSProperties }) {
  return <span style={style} />;
}
