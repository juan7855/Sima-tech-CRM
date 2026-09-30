import { motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  ListChecks,
  Sparkles,
} from "lucide-react";
const heroImg = "/images/hero-glow.jpg";
import { STRATEGY, greetingForHour, useStore, type ViewId } from "../store";
import {
  Counter,
  GhostButton,
  PrimaryButton,
  ProgressBar,
  ProgressRing,
  SectionHeader,
  SpotlightCard,
  Tag,
} from "../components/ui";
import { USER } from "../nav";
import { cn } from "../utils/cn";

/* ------------------------------------------------------------------ */
/*  Mini gráfica                                                      */
/* ------------------------------------------------------------------ */

function Sparkline({
  points,
  tone = "ember",
  className,
}: {
  points: number[];
  tone?: "ember" | "signal" | "mint";
  className?: string;
}) {
  const w = 120;
  const h = 34;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - ((p - min) / span) * (h - 6) - 3]);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const stroke = tone === "ember" ? "#FFA23A" : tone === "signal" ? "#6EA8FF" : "#4ADE9B";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("h-9 w-full", className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${tone})`} />
      <motion.path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={1.6}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Datos del resumen                                                 */
/* ------------------------------------------------------------------ */

const KPIS = [
  {
    label: "Pipeline cualificado",
    value: 1.48,
    decimals: 2,
    prefix: "$",
    suffix: "M",
    delta: 18.2,
    points: [12, 18, 16, 24, 22, 31, 29, 38, 44, 52],
    tone: "ember" as const,
  },
  {
    label: "CAC promedio",
    value: 41,
    decimals: 0,
    prefix: "$",
    delta: -6.4,
    points: [48, 46, 47, 44, 43, 42, 40, 39, 38, 41],
    tone: "signal" as const,
  },
  {
    label: "Leads activos",
    value: 9120,
    decimals: 0,
    prefix: "",
    delta: 12.5,
    points: [22, 26, 25, 31, 34, 33, 39, 44, 48, 56],
    tone: "mint" as const,
  },
];

/* ------------------------------------------------------------------ */
/*  Inicio                                                            */
/* ------------------------------------------------------------------ */

export function Home({ onNavigate }: { onNavigate: (v: ViewId) => void }) {
  const { tasks, events, toggleTask } = useStore();
  const hour = new Date().getHours();
  const greeting = greetingForHour(hour);

  const pending = tasks.filter((t) => !t.done);
  const urgent = pending.filter((t) => t.priority === "alta");
  const nextEvents = [...events].sort((a, b) => a.day - b.day).slice(0, 4);
  const doneRatio = Math.round(
    (tasks.filter((t) => t.done).length / Math.max(1, tasks.length)) * 100,
  );

  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-20 pt-2 sm:px-6 lg:px-9">
      {/* ---------------- Saludo ---------------- */}
      <SpotlightCard className="rounded-[34px] p-0">
        <div className="relative overflow-hidden rounded-[34px] px-7 py-10 sm:px-12 sm:py-14">
          <img
            src={heroImg}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-[-8%] top-0 h-full w-[68%] object-cover opacity-[0.55] mix-blend-screen"
            style={{
              maskImage: "radial-gradient(70% 80% at 70% 45%, #000 0%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(70% 80% at 70% 45%, #000 0%, transparent 78%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/45 to-transparent" />

          <div className="relative max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember-500" />
              </span>
              Command Center · {STRATEGY.quarter}
            </motion.p>

            <h1 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-[58px]">
              {greeting}, {USER.first}.
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] text-ember-gradient sm:text-[36px]"
            >
              Bienvenido a Sima Tech.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-md text-[15px] leading-relaxed text-white/50"
            >
              Tienes{" "}
              <span className="font-medium text-white/80">{pending.length} tareas pendientes</span>{" "}
              ({urgent.length} urgentes) y {nextEvents.length} hitos por delante. El equipo va al{" "}
              {doneRatio}% de la semana.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <PrimaryButton icon={ListChecks} onClick={() => onNavigate("tareas")}>
                Ver tareas pendientes
              </PrimaryButton>
              <GhostButton icon={CalendarDays} onClick={() => onNavigate("calendario")}>
                Abrir calendario
              </GhostButton>
            </motion.div>
          </div>
        </div>
      </SpotlightCard>

      {/* ---------------- KPIs ---------------- */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {KPIS.map((kpi, i) => (
          <SpotlightCard key={kpi.label} delay={0.08 + i * 0.06} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/40">
                {kpi.label}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  kpi.delta >= 0
                    ? "bg-mint-400/10 text-mint-400"
                    : "bg-ember-500/10 text-ember-300",
                )}
              >
                {kpi.delta >= 0 ? "+" : ""}
                {kpi.delta}%
              </span>
            </div>
            <p className="mt-3 text-[32px] font-semibold tracking-[-0.04em] text-white">
              {kpi.prefix}
              <Counter to={kpi.value} decimals={kpi.decimals} />
              {kpi.suffix}
            </p>
            <Sparkline points={kpi.points} tone={kpi.tone} className="mt-2" />
            <p className="mt-1 text-[11px] text-white/30">Últimos 30 días</p>
          </SpotlightCard>
        ))}
      </div>

      {/* ---------------- Hitos + Tareas ---------------- */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_1fr]">
        {/* Próximos hitos */}
        <SpotlightCard delay={0.1} className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                Próximos hitos
              </h3>
              <p className="mt-1 text-[12.5px] text-white/35">Calendario del mes en curso</p>
            </div>
            <button
              onClick={() => onNavigate("calendario")}
              className="group flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/50 transition-colors hover:border-white/20 hover:text-white"
            >
              Ver todo
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <ul className="space-y-1.5">
            {nextEvents.map((e, i) => (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.14 + i * 0.05 }}
                className="group flex items-center gap-4 rounded-2xl px-2 py-2.5 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
                  <span className="text-[15px] font-semibold leading-none text-white">
                    {e.day}
                  </span>
                  <span className="mt-0.5 text-[9px] uppercase tracking-wider text-white/35">
                    {e.time}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-white/90">{e.title}</p>
                  <p className="mt-0.5 text-[11.5px] capitalize text-white/35">{e.kind}</p>
                </div>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-white/15 transition-all duration-300 group-hover:text-ember-400"
                />
              </motion.li>
            ))}
          </ul>
        </SpotlightCard>

        {/* Tareas prioritarias */}
        <SpotlightCard delay={0.16} className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                Tareas prioritarias
              </h3>
              <p className="mt-1 text-[12.5px] text-white/35">
                {urgent.length} requieren decisión hoy
              </p>
            </div>
            <button
              onClick={() => onNavigate("tareas")}
              className="group flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/50 transition-colors hover:border-white/20 hover:text-white"
            >
              Gestionar
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <ul className="space-y-1.5">
            {pending.slice(0, 4).map((t, i) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.18 + i * 0.05 }}
                className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-white/[0.03]"
              >
                <button
                  onClick={() => toggleTask(t.id)}
                  aria-label={`Completar ${t.title}`}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 text-transparent transition-all duration-300 hover:border-ember-500/70 hover:bg-ember-500/10 hover:text-ember-400"
                >
                  <Check size={12} strokeWidth={3} />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-white/90">{t.title}</p>
                  <p className="mt-0.5 text-[11.5px] text-white/35">
                    {t.owner} · {t.due}
                  </p>
                </div>
                <Tag tone={t.priority === "alta" ? "ember" : t.priority === "media" ? "signal" : "neutral"}>
                  {t.priority}
                </Tag>
              </motion.li>
            ))}
          </ul>
        </SpotlightCard>
      </div>

      {/* ---------------- Trimestre ---------------- */}
      <div className="mt-5">
        <SectionHeader
          eyebrow="Estrategia"
          title="Estado del trimestre"
          description="Tres objetivos, una sola dirección. Revisamos el avance cada lunes a las 9:00."
          action={
            <GhostButton icon={Sparkles} onClick={() => onNavigate("estrategia")}>
              Ver estrategia
            </GhostButton>
          }
        />
        <div className="grid gap-5 sm:grid-cols-3">
          {STRATEGY.objectives.map((o, i) => {
            const pct = Math.round((o.current / o.target) * 100);
            return (
              <SpotlightCard key={o.id} delay={0.1 + i * 0.06} className="p-6">
                <div className="flex items-center gap-5">
                  <ProgressRing value={pct} label={`${pct}%`} sublabel="avance" size={84} />
                  <div className="min-w-0">
                    <h4 className="text-[15px] font-semibold leading-snug tracking-[-0.02em] text-white">
                      {o.title}
                    </h4>
                    <p className="mt-1.5 text-[12px] text-white/40">
                      {o.metric} · {o.owner}
                    </p>
                    <p className="mt-2 text-[12.5px] text-white/55">
                      {o.current}
                      {o.unit === "%" ? "%" : ` ${o.unit}`} de {o.target}
                      {o.unit === "%" ? "%" : ` ${o.unit}`}
                    </p>
                  </div>
                </div>
                <ProgressBar value={pct} className="mt-5" />
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
