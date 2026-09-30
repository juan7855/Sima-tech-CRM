import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, GripVertical, Plus, Trash2 } from "lucide-react";
import {
  KANBAN_COLUMNS,
  useStore,
  type KanbanCard,
  type Priority,
  type Task,
} from "../store";
import {
  Counter,
  GhostButton,
  ProgressBar,
  ProgressRing,
  SectionHeader,
  SpotlightCard,
  Tag,
} from "../components/ui";
import { cn } from "../utils/cn";

const FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "pendientes", label: "Pendientes" },
  { id: "completadas", label: "Completadas" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const PRIORITY_TONE: Record<Priority, "ember" | "signal" | "neutral"> = {
  alta: "ember",
  media: "signal",
  baja: "neutral",
};

export function Tasks() {
  const { tasks, cards, toggleTask, addTask, removeTask, moveCard, addCard, owners } =
    useStore();

  const [filter, setFilter] = useState<FilterId>("pendientes");
  const [newTitle, setNewTitle] = useState("");
  const [newOwner, setNewOwner] = useState(owners[0]);
  const [newPriority, setNewPriority] = useState<Priority>("media");
  const [newDue, setNewDue] = useState("Viernes");
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [addingIn, setAddingIn] = useState<string | null>(null);
  const [cardTitle, setCardTitle] = useState("");

  const visible = useMemo(() => {
    if (filter === "pendientes") return tasks.filter((t) => !t.done);
    if (filter === "completadas") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  const done = tasks.filter((t) => t.done).length;
  const pending = tasks.length - done;
  const high = tasks.filter((t) => !t.done && t.priority === "alta").length;
  const completion = Math.round((done / Math.max(1, tasks.length)) * 100);

  const submitTask = () => {
    const clean = newTitle.trim();
    if (!clean) return;
    addTask({
      title: clean,
      detail: "Tarea creada desde el command center.",
      owner: newOwner,
      due: newDue || "Sin fecha",
      priority: newPriority,
    });
    setNewTitle("");
  };

  const submitCard = (column: string) => {
    const clean = cardTitle.trim();
    if (!clean) return;
    addCard({ title: clean, tag: "Nueva", column, progress: 0, owner: newOwner });
    setCardTitle("");
    setAddingIn(null);
  };

  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-20 pt-2 sm:px-6 lg:px-9">
      <SectionHeader
        eyebrow="Tareas y metas"
        title="Lo pendiente, en orden"
        description="Primero lo que bloquea al equipo. El tablero mantiene el contexto de cada meta en curso."
        action={
          <div className="inline-flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
                  filter === f.id ? "text-black" : "text-white/45 hover:text-white/80",
                )}
              >
                {filter === f.id && (
                  <motion.span
                    layoutId="task-filter"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-b from-ember-300 to-ember-500"
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        {/* ---------------- Lista de tareas ---------------- */}
        <SpotlightCard className="flex flex-col p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                Tareas pendientes
              </h3>
              <p className="mt-1 text-[12.5px] text-white/35">
                {visible.length} en esta vista · {high} de prioridad alta
              </p>
            </div>
            <Tag tone="ember">
              <Counter to={pending} /> abiertas
            </Tag>
          </div>

          {/* Nueva tarea */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitTask();
            }}
            className="mb-5 space-y-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5"
          >
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nueva tarea…"
              className="w-full bg-transparent px-1 text-[13.5px] text-white placeholder:text-white/25 focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              <select
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="flex-1 appearance-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[12px] text-white/60 focus:outline-none"
              >
                {owners.map((o) => (
                  <option key={o} value={o} className="bg-ink-850">
                    {o}
                  </option>
                ))}
              </select>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                className="w-28 appearance-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[12px] text-white/60 focus:outline-none"
              >
                <option value="alta" className="bg-ink-850">
                  Alta
                </option>
                <option value="media" className="bg-ink-850">
                  Media
                </option>
                <option value="baja" className="bg-ink-850">
                  Baja
                </option>
              </select>
              <input
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                placeholder="Para cuándo"
                className="w-32 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[12px] text-white/60 placeholder:text-white/25 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-ember-400 to-ember-600 px-3.5 py-1.5 text-[12px] font-semibold text-black transition-transform active:scale-95"
              >
                <Plus size={13} /> Añadir
              </button>
            </div>
          </form>

          <ul className="space-y-1.5">
            <AnimatePresence mode="popLayout">
              {visible.map((t, i) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  index={i}
                  onToggle={() => toggleTask(t.id)}
                  onRemove={() => removeTask(t.id)}
                />
              ))}
            </AnimatePresence>
          </ul>

          {visible.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/[0.09] px-4 py-10 text-center">
              <p className="text-[13px] text-white/40">Nada por aquí.</p>
              <p className="mt-1 text-[12px] text-white/25">
                Cambia el filtro o crea una tarea nueva.
              </p>
            </div>
          )}
        </SpotlightCard>

        {/* ---------------- Resumen ---------------- */}
        <div className="space-y-5">
          <SpotlightCard delay={0.08} className="p-6">
            <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-white">
              Progreso del equipo
            </h3>
            <div className="mt-6 flex items-center gap-6">
              <ProgressRing
                value={completion}
                label={`${completion}%`}
                sublabel="completado"
                size={104}
              />
              <div className="flex-1 space-y-3">
                <Stat label="Completadas" value={done} />
                <Stat label="Pendientes" value={pending} />
                <Stat label="Prioridad alta" value={high} tone="ember" />
              </div>
            </div>
            <ProgressBar value={completion} className="mt-6" />
            <p className="mt-3 text-[12px] text-white/35">
              Meta semanal: 80% de tareas cerradas antes del viernes.
            </p>
          </SpotlightCard>

          <SpotlightCard delay={0.14} className="p-6">
            <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-white">
              Metas en curso
            </h3>
            <p className="mt-1 text-[12.5px] text-white/35">
              {cards.filter((c) => c.column === "curso").length} metas activas de{" "}
              {cards.length}
            </p>
            <ul className="mt-5 space-y-4">
              {cards
                .filter((c) => c.column !== "hecho")
                .slice(0, 4)
                .map((c, i) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.16 + i * 0.06 }}
                  >
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <span className="truncate text-[13px] text-white/80">{c.title}</span>
                      <span className="shrink-0 text-[11.5px] text-white/35">
                        {c.progress}%
                      </span>
                    </div>
                    <ProgressBar value={c.progress} tone={c.progress > 60 ? "mint" : "signal"} />
                  </motion.li>
                ))}
            </ul>
          </SpotlightCard>
        </div>
      </div>

      {/* ---------------- Kanban ---------------- */}
      <div className="mt-10 mb-4 flex items-end justify-between">
        <div>
          <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-white">
            Tablero de metas
          </h3>
          <p className="mt-1 text-[12.5px] text-white/35">
            Arrastra una meta entre columnas o toca los puntos para moverla.
          </p>
        </div>
        <GhostButton onClick={() => setAddingIn(addingIn ? null : "idea")} icon={Plus}>
          Nueva meta
        </GhostButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {KANBAN_COLUMNS.map((col) => {
          const colCards = cards.filter((c) => c.column === col.id);
          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(col.id);
              }}
              onDragLeave={() => setDragOver((d) => (d === col.id ? null : d))}
              onDrop={() => {
                if (draggedId) moveCard(draggedId, col.id);
                setDraggedId(null);
                setDragOver(null);
              }}
              className={cn(
                "flex min-h-[280px] flex-col rounded-3xl border p-3 transition-colors duration-300",
                dragOver === col.id
                  ? "border-ember-500/40 bg-ember-500/[0.07]"
                  : "border-white/[0.06] bg-white/[0.015]",
              )}
            >
              <div className="mb-3 flex items-center justify-between px-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold tracking-[-0.01em] text-white">
                    {col.title}
                  </span>
                  <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[10.5px] text-white/45">
                    {colCards.length}
                  </span>
                </div>
                <button
                  onClick={() => setAddingIn(addingIn === col.id ? null : col.id)}
                  aria-label={`Añadir meta a ${col.title}`}
                  className="rounded-lg p-1 text-white/25 transition-colors hover:bg-white/5 hover:text-white/70"
                >
                  <Plus size={14} />
                </button>
              </div>

              <AnimatePresence>
                {addingIn === col.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <input
                      autoFocus
                      value={cardTitle}
                      onChange={(e) => setCardTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitCard(col.id);
                        if (e.key === "Escape") setAddingIn(null);
                      }}
                      placeholder="Nombre de la meta"
                      className="mb-2 w-full rounded-2xl border border-ember-500/30 bg-white/[0.04] px-3 py-2 text-[12.5px] text-white placeholder:text-white/25 focus:outline-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <ul className="flex flex-1 flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {colCards.map((card, i) => (
                    <KanbanRow
                      key={card.id}
                      card={card}
                      index={i}
                      onDragStart={() => setDraggedId(card.id)}
                      onDragEnd={() => setDraggedId(null)}
                      onMove={(column) => moveCard(card.id, column)}
                    />
                  ))}
                </AnimatePresence>
                {colCards.length === 0 && (
                  <li className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/[0.07] py-8">
                    <span className="text-[11.5px] text-white/20">Soltar aquí</span>
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "ember";
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[12.5px] text-white/40">{label}</span>
      <span
        className={cn(
          "text-[15px] font-semibold tracking-tight",
          tone === "ember" ? "text-ember-300" : "text-white",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function TaskRow({
  task,
  index,
  onToggle,
  onRemove,
}: {
  task: Task;
  index: number;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, height: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
      className="group flex items-center gap-3 rounded-2xl border border-transparent px-2 py-3 transition-colors hover:border-white/[0.05] hover:bg-white/[0.02]"
    >
      <button
        onClick={onToggle}
        aria-label={task.done ? `Reabrir ${task.title}` : `Completar ${task.title}`}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
          task.done
            ? "border-mint-400/60 bg-mint-400/15 text-mint-400"
            : "border-white/15 text-transparent hover:border-ember-500/70 hover:bg-ember-500/10 hover:text-ember-400",
        )}
      >
        <Check size={12} strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-[13.5px] font-medium transition-colors",
            task.done ? "text-white/25 line-through" : "text-white/90",
          )}
        >
          {task.title}
        </p>
        <p className="mt-0.5 truncate text-[11.5px] text-white/35">
          {task.owner} · {task.due}
        </p>
      </div>

      <Tag tone={PRIORITY_TONE[task.priority]} className="hidden sm:inline-flex">
        {task.priority}
      </Tag>

      <button
        onClick={onRemove}
        aria-label={`Eliminar ${task.title}`}
        className="rounded-lg p-1.5 text-white/0 transition-all hover:bg-ember-500/10 hover:text-ember-300 group-hover:text-white/20"
      >
        <Trash2 size={14} />
      </button>
    </motion.li>
  );
}

function KanbanRow({
  card,
  index,
  onDragStart,
  onDragEnd,
  onMove,
}: {
  card: KanbanCard;
  index: number;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMove: (column: string) => void;
}) {
  return (
    <motion.li
      layout
      draggable
      onDragStart={(e) => {
        const ev = e as unknown as React.DragEvent;
        ev.dataTransfer?.setData("text/plain", card.id);
        if (ev.dataTransfer) ev.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2) }}
      whileHover={{ y: -2 }}
      className="group cursor-grab active:cursor-grabbing"
    >
      <div className="rounded-2xl border border-white/[0.06] bg-ink-850/80 p-3.5 backdrop-blur-xl transition-colors group-hover:border-white/12">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-medium leading-snug text-white/90">{card.title}</p>
          <GripVertical
            size={14}
            className="mt-0.5 shrink-0 text-white/10 transition-colors group-hover:text-white/30"
          />
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <Tag tone="neutral">{card.tag}</Tag>
          <span className="text-[11px] text-white/30">{card.owner}</span>
        </div>

        <div className="mt-3">
          <ProgressBar
            value={card.progress}
            tone={card.progress === 100 ? "mint" : "ember"}
            showTrack={false}
            className="h-1 rounded-full bg-white/[0.06]"
          />
          <p className="mt-1.5 text-[10.5px] text-white/30">{card.progress}% completado</p>
        </div>

        {/* Mover entre columnas (accesible y táctil) */}
        <div className="mt-3 flex items-center gap-1.5 border-t border-white/[0.05] pt-3">
          {KANBAN_COLUMNS.map((c) => (
            <button
              key={c.id}
              onClick={() => onMove(c.id)}
              aria-label={`Mover a ${c.title}`}
              title={c.title}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all",
                card.column === c.id
                  ? "bg-ember-500"
                  : "bg-white/10 hover:bg-white/25",
              )}
            />
          ))}
        </div>
      </div>
    </motion.li>
  );
}
