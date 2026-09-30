import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Clock, Plus, Trash2 } from "lucide-react";
import { MONTHS, WEEKDAYS, useStore, type CalendarEvent } from "../store";
import { GhostButton, PrimaryButton, SectionHeader, SpotlightCard, Tag } from "../components/ui";
import { cn } from "../utils/cn";

const KINDS: {
  id: CalendarEvent["kind"];
  label: string;
  dot: string;
  tone: "ember" | "signal" | "mint" | "violet" | "neutral";
}[] = [
  { id: "campana", label: "Campaña", dot: "bg-ember-400", tone: "ember" },
  { id: "lanzamiento", label: "Lanzamiento", dot: "bg-ember-500", tone: "ember" },
  { id: "contenido", label: "Contenido", dot: "bg-signal-400", tone: "signal" },
  { id: "reunion", label: "Reunión", dot: "bg-violet-soft", tone: "violet" },
  { id: "entrega", label: "Entrega", dot: "bg-mint-400", tone: "mint" },
];

const kindMeta = (kind: CalendarEvent["kind"]) =>
  KINDS.find((k) => k.id === kind) ?? KINDS[0];

export function Calendar() {
  const { events, addEvent, removeEvent } = useStore();
  const today = new Date();

  const [view, setView] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });
  const [selected, setSelected] = useState(today.getDate());
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [kind, setKind] = useState<CalendarEvent["kind"]>("campana");

  const monthEvents = useMemo(
    () => events.filter((e) => e.month === view.month && e.year === view.year),
    [events, view],
  );

  const grid = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const offset = (first.getDay() + 6) % 7; // lunes = 0
    const days = new Date(view.year, view.month + 1, 0).getDate();
    const cells: (number | null)[] = Array.from({ length: offset }, () => null);
    for (let d = 1; d <= days; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [view]);

  const selectedEvents = monthEvents
    .filter((e) => e.day === selected)
    .sort((a, b) => a.time.localeCompare(b.time));

  const shift = (dir: number) => {
    const d = new Date(view.year, view.month + dir, 1);
    setView({ month: d.getMonth(), year: d.getFullYear() });
    setSelected(1);
  };

  const submit = () => {
    const clean = title.trim();
    if (!clean) return;
    addEvent({ day: selected, month: view.month, year: view.year, time, title: clean, kind });
    setTitle("");
  };

  const isToday = (d: number) =>
    d === today.getDate() &&
    view.month === today.getMonth() &&
    view.year === today.getFullYear();

  const selectedDate = new Date(view.year, view.month, selected);
  const selectedLabel = selectedDate.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-20 pt-2 sm:px-6 lg:px-9">
      <SectionHeader
        eyebrow="Calendario"
        title="El mes, de un vistazo"
        description="Hitos, campañas y entregas del equipo. Selecciona un día para ver el detalle o añadir un hito."
        action={
          <GhostButton
            onClick={() => {
              setView({ month: today.getMonth(), year: today.getFullYear() });
              setSelected(today.getDate());
            }}
          >
            Ir a hoy
          </GhostButton>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* ---------------- Rejilla ---------------- */}
        <SpotlightCard className="p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={`${view.month}-${view.year}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-[19px] font-semibold tracking-[-0.02em] text-white"
                >
                  {MONTHS[view.month]}{" "}
                  <span className="text-white/35">{view.year}</span>
                </motion.h3>
              </AnimatePresence>
              <p className="mt-1 text-[12px] text-white/35">
                {monthEvents.length} hitos este mes
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => shift(-1)}
                aria-label="Mes anterior"
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2 text-white/50 transition-colors hover:border-white/20 hover:text-white"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => shift(1)}
                aria-label="Mes siguiente"
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2 text-white/50 transition-colors hover:border-white/20 hover:text-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="py-1 text-center text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/25"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {grid.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />;
              const dayEvents = monthEvents.filter((e) => e.day === day);
              const isSelected = day === selected;
              return (
                <motion.button
                  key={`${view.month}-${day}`}
                  onClick={() => setSelected(day)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "relative flex h-[68px] flex-col items-center justify-start rounded-2xl border p-1.5 pt-2 transition-colors sm:h-[78px]",
                    isSelected
                      ? "border-ember-500/50 bg-ember-500/[0.12]"
                      : "border-white/[0.05] bg-white/[0.015] hover:border-white/15 hover:bg-white/[0.05]",
                  )}
                >
                  <span
                    className={cn(
                      "text-[13px] font-medium",
                      isSelected ? "text-ember-300" : isToday(day) ? "text-white" : "text-white/55",
                    )}
                  >
                    {day}
                  </span>
                  {isToday(day) && (
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-ember-500 shadow-[0_0_10px_2px_rgba(255,122,24,0.7)]" />
                  )}
                  <span className="mt-auto flex items-center gap-[3px]">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className={cn("h-1 w-1 rounded-full", kindMeta(e.kind).dot)}
                      />
                    ))}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.06] pt-4">
            {KINDS.map((k) => (
              <span key={k.id} className="flex items-center gap-1.5 text-[11.5px] text-white/40">
                <span className={cn("h-1.5 w-1.5 rounded-full", k.dot)} />
                {k.label}
              </span>
            ))}
          </div>
        </SpotlightCard>

        {/* ---------------- Detalle del día ---------------- */}
        <SpotlightCard delay={0.08} className="flex flex-col p-6">
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-400/80">
              {isToday(selected) ? "Hoy" : "Seleccionado"}
            </p>
            <h3 className="mt-2 text-[19px] font-semibold capitalize tracking-[-0.02em] text-white">
              {selectedLabel}
            </h3>
          </div>

          <div className="max-h-[240px] flex-1 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {selectedEvents.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-white/[0.09] px-4 py-8 text-center"
                >
                  <p className="text-[13px] text-white/40">Sin hitos para este día.</p>
                  <p className="mt-1 text-[12px] text-white/25">
                    Añade el primero con el formulario.
                  </p>
                </motion.div>
              ) : (
                <ul className="space-y-2">
                  {selectedEvents.map((e) => (
                    <motion.li
                      key={e.id}
                      layout
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -14 }}
                      transition={{ duration: 0.35 }}
                      className="group flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3"
                    >
                      <span className={cn("h-8 w-1 shrink-0 rounded-full", kindMeta(e.kind).dot)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium text-white/90">
                          {e.title}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-white/35">
                          <Clock size={11} />
                          {e.time} · {kindMeta(e.kind).label}
                        </p>
                      </div>
                      <button
                        onClick={() => removeEvent(e.id)}
                        className="rounded-lg p-1.5 text-white/20 opacity-0 transition-all hover:bg-ember-500/10 hover:text-ember-300 focus:opacity-100 group-hover:opacity-100"
                        aria-label={`Eliminar ${e.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </AnimatePresence>
          </div>

          {/* Formulario */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mt-6 space-y-3 border-t border-white/[0.06] pt-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Nuevo hito
            </p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre del hito"
              className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[13.5px] text-white placeholder:text-white/25 transition-colors focus:border-ember-500/40 focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-28 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[13.5px] text-white/70 focus:border-ember-500/40 focus:outline-none"
              />
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as CalendarEvent["kind"])}
                className="flex-1 appearance-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[13.5px] text-white/70 focus:border-ember-500/40 focus:outline-none"
              >
                {KINDS.map((k) => (
                  <option key={k.id} value={k.id} className="bg-ink-850">
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
            <PrimaryButton icon={Plus} type="submit" className="w-full justify-center">
              Añadir al calendario
            </PrimaryButton>
          </form>
        </SpotlightCard>
      </div>

      {/* Resumen del mes */}
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <SpotlightCard delay={0.12} className="p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/30">Hitos del mes</p>
          <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-white">
            {monthEvents.length}
          </p>
        </SpotlightCard>
        <SpotlightCard delay={0.16} className="p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/30">Día más cargado</p>
          <p className="mt-2 text-[15px] font-semibold tracking-[-0.02em] text-white">
            {busiestDay(monthEvents)}
          </p>
        </SpotlightCard>
        <SpotlightCard delay={0.2} className="p-5">
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-white/30">
            Próximo hito
          </p>
          <Tag tone="ember">
            {monthEvents.length > 0
              ? `${MONTHS[monthEvents[0].month]} ${monthEvents[0].day} · ${monthEvents[0].time}`
              : "Sin programar"}
          </Tag>
        </SpotlightCard>
      </div>
    </div>
  );
}

function busiestDay(list: CalendarEvent[]) {
  if (list.length === 0) return "—";
  const counts = new Map<number, number>();
  list.forEach((e) => counts.set(e.day, (counts.get(e.day) ?? 0) + 1));
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return `Día ${best[0]} · ${best[1]} hitos`;
}
