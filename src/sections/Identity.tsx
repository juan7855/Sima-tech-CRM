import { useState } from "react";
import { motion } from "motion/react";
import { Check, Compass, Copy, Radar, Shield, Sparkles, X } from "lucide-react";
import { IDENTITY } from "../store";
import { SectionHeader, SpotlightCard, Tag } from "../components/ui";
import { LogoMark } from "../components/Logo";
import { cn } from "../utils/cn";

const ICONS: Record<string, typeof Compass> = {
  compass: Compass,
  pulse: Radar,
  spark: Sparkles,
  shield: Shield,
};

export function Identity() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      /* el portapapeles puede no estar disponible */
    }
    setCopied(hex);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-20 pt-2 sm:px-6 lg:px-9">
      <SectionHeader
        eyebrow="Nuestra identidad"
        title="Quiénes somos cuando nadie mira"
        description={IDENTITY.intro}
        action={<Tag tone="ember">Manual vivo · v3.2</Tag>}
      />

      {/* Misión / Visión */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SpotlightCard className="p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ember-400/80">
            Misión
          </p>
          <p className="mt-4 text-[19px] font-medium leading-[1.45] tracking-[-0.02em] text-white">
            {IDENTITY.mission}
          </p>
        </SpotlightCard>
        <SpotlightCard delay={0.06} className="p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
            Visión
          </p>
          <p className="mt-4 text-[19px] font-medium leading-[1.45] tracking-[-0.02em] text-white/75">
            {IDENTITY.vision}
          </p>
        </SpotlightCard>
      </div>

      {/* Claim */}
      <SpotlightCard delay={0.1} className="mt-5 overflow-hidden p-0">
        <div className="relative px-7 py-12 text-center sm:px-12">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/[0.12] blur-[80px]" />
          <p className="relative text-[26px] font-semibold leading-[1.25] tracking-[-0.035em] text-ember-gradient sm:text-[34px]">
            «{IDENTITY.claim}»
          </p>
          <div className="relative mt-7 flex items-center justify-center gap-3">
            <LogoMark size={26} />
            <span className="text-[12px] uppercase tracking-[0.24em] text-white/35">
              Sima Tech
            </span>
          </div>
        </div>
      </SpotlightCard>

      {/* Valores */}
      <h3 className="mb-4 mt-10 text-[17px] font-semibold tracking-[-0.02em] text-white">
        Valores innegociables
      </h3>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {IDENTITY.values.map((v, i) => {
          const Icon = ICONS[v.icon] ?? Sparkles;
          return (
            <SpotlightCard key={v.title} delay={0.08 + i * 0.05} className="p-6">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-ember-500/25 bg-ember-500/10 text-ember-400">
                <Icon size={17} strokeWidth={1.7} />
              </span>
              <h4 className="text-[15px] font-semibold tracking-[-0.01em] text-white">
                {v.title}
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-white/45">{v.text}</p>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Voz + Personalidad */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <SpotlightCard delay={0.1} className="p-7">
          <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-white">
            Personalidad
          </h3>
          <p className="mt-2 text-[13px] text-white/40">
            Cuatro rasgos que definen cada decisión de marca.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {IDENTITY.personality.map((p, i) => (
              <motion.span
                key={p}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] text-white/75"
              >
                {p}
              </motion.span>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4">
            <div>
              <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-mint-400">
                <Check size={13} /> Sí
              </p>
              <ul className="space-y-2">
                {IDENTITY.tone.si.map((t) => (
                  <li key={t} className="text-[13px] text-white/60">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ember-400">
                <X size={13} /> No
              </p>
              <ul className="space-y-2">
                {IDENTITY.tone.no.map((t) => (
                  <li key={t} className="text-[13px] text-white/35 line-through decoration-white/20">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SpotlightCard>

        {/* Paleta */}
        <SpotlightCard delay={0.16} className="p-7">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                Paleta
              </h3>
              <p className="mt-2 text-[13px] text-white/40">
                Toca un color para copiar el código.
              </p>
            </div>
            <Tag tone={copied ? "mint" : "neutral"}>
              {copied ? `${copied} copiado` : "HEX"}
            </Tag>
          </div>

          <div className="mt-6 space-y-2">
            {IDENTITY.palette.map((c, i) => (
              <motion.button
                key={c.hex}
                onClick={() => copy(c.hex)}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.05 }}
                whileHover={{ x: -3 }}
                className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3 text-left transition-colors hover:border-white/15"
              >
                <span
                  className="h-11 w-11 shrink-0 rounded-xl border border-white/10 shadow-inner"
                  style={{ background: c.hex }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-medium text-white">
                    {c.name}
                  </span>
                  <span className="block text-[11.5px] text-white/35">{c.use}</span>
                </span>
                <span className="font-mono text-[12px] text-white/45">{c.hex}</span>
                <Copy
                  size={14}
                  className="shrink-0 text-white/20 transition-colors group-hover:text-ember-400"
                />
              </motion.button>
            ))}
          </div>
        </SpotlightCard>
      </div>

      {/* Tipografía */}
      <SpotlightCard delay={0.2} className="mt-5 p-7">
        <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-white">Tipografía</h3>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          {IDENTITY.typography.map((t) => (
            <div key={t.name}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">
                {t.role} · {t.detail}
              </p>
              <p className="mt-3 text-[42px] font-semibold leading-none tracking-[-0.045em] text-white">
                Aa
              </p>
              <p className="mt-3 text-[13px] text-white/40">{t.name}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-white/[0.06] pt-6">
          <p className="text-[19px] leading-[1.5] tracking-[-0.02em] text-white/70">
            La claridad es una forma de respeto:{" "}
            <span className={cn("text-white")}>
      menos ruido, mejor señal, decisiones más rápidas.
            </span>
          </p>
        </div>
      </SpotlightCard>
    </div>
  );
}
