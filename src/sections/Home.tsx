import { motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  ListChecks,
} from "lucide-react";
import { LogoHero } from "../components/Logo";
import { STRATEGY, greetingForHour, useStore, type ViewId } from "../store";
import {
  GhostButton,
  PrimaryButton,
  ProgressBar,
  ProgressRing,
  SpotlightCard,
  Tag,
} from "../components/ui";
import { USER } from "../nav";

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
  const doneCount = tasks.length - pending.length;
  const doneRatio = Math.round((doneCount / Math.max(1, tasks.length)) * 100);

  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-20 pt-2 sm:px-6 lg:px-9">
      {/* ---------------- Saludo ---------------- */}
      <SpotlightCard className="rounded-[34px] p-0">
        <div className="relative overflow-hidden rounded-[34px] px-7 py-10 sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/30 to-transparent" />

          <LogoHero
            size={250}
            className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 lg:block xl:right-10"
          />

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

      {/* ---------------- Progreso de tareas ---------------- */}
      <SpotlightCard delay={0.08} className="mt-5 p-6 sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <ProgressRing value={doneRatio} label={`${doneRatio}%`} sublabel="completado" size={104} />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/40">
              Progreso del equipo
            </p>
            <h3 className="mt-1.5 text-[22px] font-semibold tracking-[-0.03em] text-white">
              {doneCount} de {tasks.length} tareas cumplidas
            </h3>
            <p className="mt-1 text-[13px] text-white/40">
              {pending.length === 0
                ? "Todo al día. No quedan tareas pendientes."
                : `Quedan ${pending.length} por cerrar, ${urgent.length} de prioridad alta.`}
            </p>
            <ProgressBar value={doneRatio} className="mt-5" />
          </div>
          <GhostButton icon={ListChecks} onClick={() => onNavigate("tareas")}>
            Ver tareas
          </GhostButton>
        </div>
      </SpotlightCard>
    </div>
  );
}
