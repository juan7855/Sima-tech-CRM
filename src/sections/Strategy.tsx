import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Flame, Target, TrendingUp } from "lucide-react";
import { STRATEGY, fmtNumber } from "../store";
import {
  GhostButton,
  PrimaryButton,
  ProgressBar,
  SectionHeader,
  SpotlightCard,
  Tag,
} from "../components/ui";
import { cn } from "../utils/cn";

const TABS = [
  { id: "objetivos", label: "Objetivos", icon: Target },
  { id: "embudo", label: "Embudo", icon: ArrowDownRight },
  { id: "canales", label: "Canales", icon: TrendingUp },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Strategy() {
  const [tab, setTab] = useState<TabId>("objetivos");

  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-20 pt-2 sm:px-6 lg:px-9">
      <SectionHeader
        eyebrow="Estrategia"
        title={`Dirección ${STRATEGY.quarter}`}
        description="Tres objetivos, un embudo y cinco canales. Una sola página para saber dónde estamos y qué toca mover."
        action={<Tag tone="ember">Revisión semanal · lunes 9:00</Tag>}
      />

      {/* Selector de vista */}
      <div className="mb-6 inline-flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1 backdrop-blur-xl">
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                isActive ? "text-black" : "text-white/50 hover:text-white/85",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="strategy-tab"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-ember-300 to-ember-500 shadow-[0_8px_24px_-8px_rgba(255,122,24,0.8)]"
                />
              )}
              <t.icon size={15} className="relative z-10" />
              <span className="relative z-10">{t.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ---------------- OBJETIVOS ---------------- */}
          {tab === "objetivos" && (
            <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
              <div className="space-y-5">
                {STRATEGY.objectives.map((o, i) => {
                  const pct = Math.round((o.current / o.target) * 100);
                  return (
                    <SpotlightCard key={o.id} delay={i * 0.06} className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-sm">
                          <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-white">
                            {o.title}
                          </h3>
                          <p className="mt-1.5 text-[12.5px] text-white/40">
                            Responsable: {o.owner}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[26px] font-semibold tracking-[-0.04em] text-white">
                            {o.current}
                            {o.unit === "%" ? "%" : ""}
                          </p>
                          <p className="text-[11.5px] text-white/35">
                            meta {o.target}
                            {o.unit === "%" ? "%" : ` ${o.unit}`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-3">
                        <ProgressBar value={pct} className="flex-1" />
                        <span className="w-10 text-right text-[12.5px] font-semibold text-ember-300">
                          {pct}%
                        </span>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>

              <SpotlightCard delay={0.1} className="p-6">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ember-500/25 bg-ember-500/10 text-ember-400">
                    <Flame size={16} />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-white">
                      Apuestas del trimestre
                    </h3>
                    <p className="text-[12px] text-white/35">Donde invertimos el tiempo</p>
                  </div>
                </div>

                <ul className="mt-6 space-y-4">
                  {STRATEGY.bets.map((b, i) => (
                    <motion.li
                      key={b.title}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.16 + i * 0.07 }}
                      className="border-l border-white/10 pl-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-[13.5px] font-medium text-white">{b.title}</h4>
                        <Tag
                          tone={
                            b.status === "En curso"
                              ? "mint"
                              : b.status === "Diseño"
                                ? "signal"
                                : "neutral"
                          }
                        >
                          {b.status}
                        </Tag>
                      </div>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/40">
                        {b.text}
                      </p>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-[12.5px] leading-relaxed text-white/50">
                    Regla del trimestre: si una acción no mueve pipeline o reduce CAC, no
                    entra en la lista.
                  </p>
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* ---------------- EMBUDO ---------------- */}
          {tab === "embudo" && (
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <SpotlightCard className="p-6 sm:p-8">
                <div className="mb-7 flex items-baseline justify-between">
                  <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-white">
                    Embudo de conversión
                  </h3>
                  <span className="text-[11.5px] text-white/30">
                    Escala visual √ · datos reales
                  </span>
                </div>

                <div className="space-y-3">
                  {STRATEGY.funnel.map((f, i) => {
                    const width = Math.sqrt(f.value / STRATEGY.funnel[0].value) * 100;
                    return (
                      <motion.div
                        key={f.stage}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.07 }}
                        className="group"
                      >
                        <div className="mb-1.5 flex items-baseline justify-between text-[12.5px]">
                          <span className="font-medium text-white/80">{f.stage}</span>
                          <span className="text-white/35">
                            {fmtNumber(f.value)} · {f.conversion}%
                          </span>
                        </div>
                        <div className="h-9 w-full overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${width}%` }}
                            transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                            className="relative flex h-full items-center justify-end rounded-xl bg-gradient-to-r from-ember-600/70 via-ember-500/60 to-ember-400/50 pr-3"
                          >
                            <span className="text-[11px] font-medium text-white/80">
                              {f.note}
                            </span>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </SpotlightCard>

              <div className="space-y-5">
                {STRATEGY.funnel.slice(1).map((f, i) => {
                  const prev = STRATEGY.funnel[i];
                  return (
                    <SpotlightCard key={f.stage} delay={0.08 + i * 0.05} className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-white/30">
                            {prev.stage} → {f.stage}
                          </p>
                          <p className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-white">
                            {f.conversion}%
                          </p>
                        </div>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-white/40">
                          <ArrowDownRight size={16} />
                        </span>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------------- CANALES ---------------- */}
          {tab === "canales" && (
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <SpotlightCard className="p-6 sm:p-7">
                <h3 className="mb-6 text-[16px] font-semibold tracking-[-0.02em] text-white">
                  Reparto de inversión
                </h3>
                <ul className="space-y-5">
                  {STRATEGY.channels.map((c, i) => (
                    <motion.li
                      key={c.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: i * 0.06 }}
                    >
                      <div className="mb-2 flex items-baseline justify-between">
                        <span className="text-[13.5px] font-medium text-white/85">{c.name}</span>
                        <span className="text-[12.5px] text-white/40">{c.share}%</span>
                      </div>
                      <ProgressBar value={c.share * 2.6} tone={i % 2 ? "signal" : "ember"} />
                    </motion.li>
                  ))}
                </ul>
              </SpotlightCard>

              <div className="space-y-3">
                {STRATEGY.channels.map((c, i) => (
                  <SpotlightCard key={c.name} delay={0.06 + i * 0.05} className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-medium text-white/85">
                          {c.name}
                        </p>
                        <p className="mt-0.5 text-[11.5px] text-white/35">
                          ROI {c.roi.toFixed(1)}x
                        </p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold",
                          c.trend >= 0
                            ? "bg-mint-400/10 text-mint-400"
                            : "bg-ember-500/10 text-ember-300",
                        )}
                      >
                        {c.trend >= 0 ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        {Math.abs(c.trend)}%
                      </span>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <SpotlightCard delay={0.12} className="mt-6 p-6 sm:p-7">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-white">
              ¿Ajustamos la estrategia esta semana?
            </h3>
            <p className="mt-1.5 text-[13px] text-white/45">
              Reserva 30 minutos con el equipo y revisamos objetivos y canales.
            </p>
          </div>
          <div className="flex gap-3">
            <GhostButton>Más tarde</GhostButton>
            <PrimaryButton>Agendar revisión</PrimaryButton>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
