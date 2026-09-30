import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Menu, Search } from "lucide-react";
import { NAV, USER } from "../nav";
import { useStore, type ViewId } from "../store";
import { cn } from "../utils/cn";

const KIND_TONE: Record<string, string> = {
  lanzamiento: "bg-ember-500",
  campana: "bg-ember-400",
  contenido: "bg-signal-400",
  reunion: "bg-violet-soft",
  entrega: "bg-mint-400",
};

export function Topbar({
  active,
  onOpenMobile,
  onOpenPalette,
}: {
  active: ViewId;
  onOpenMobile: () => void;
  onOpenPalette: () => void;
}) {
  const { tasks, events } = useStore();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const item = NAV.find((n) => n.id === active)!;

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const pending = tasks.filter((t) => !t.done);
  const urgent = pending.filter((t) => t.priority === "alta").length;
  const upcoming = [...events]
    .sort((a, b) => a.day - b.day)
    .slice(0, 4);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenPalette]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-ink-950/55 backdrop-blur-2xl">
      <div className="flex h-[68px] items-center gap-3 px-4 sm:px-6 lg:px-9">
        <button
          onClick={onOpenMobile}
          aria-label="Abrir menú"
          className="rounded-xl p-2 text-white/55 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
        >
          <Menu size={19} />
        </button>

        <div className="min-w-0 flex-1">
          <motion.h1
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="truncate text-[15px] font-semibold tracking-[-0.01em] text-white"
          >
            {item.label}
          </motion.h1>
          <p className="truncate text-[11.5px] capitalize text-white/35">{today}</p>
        </div>

        {/* Buscador */}
        <button
          onClick={onOpenPalette}
          className="group hidden items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] py-2 pl-3 pr-2 text-[13px] text-white/35 transition-colors hover:border-white/15 hover:text-white/60 sm:flex"
        >
          <Search size={15} />
          <span className="pr-6">Buscar…</span>
          <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40">
            ⌘K
          </kbd>
        </button>
        <button
          onClick={onOpenPalette}
          aria-label="Buscar"
          className="rounded-xl p-2 text-white/55 transition-colors hover:bg-white/5 hover:text-white sm:hidden"
        >
          <Search size={18} />
        </button>

        {/* Notificaciones */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen((v) => !v)}
            aria-label="Notificaciones"
            aria-expanded={bellOpen}
            className="relative rounded-xl p-2 text-white/55 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Bell size={18} />
            {urgent > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-ember-500 text-[8px] font-bold text-black">
                {urgent}
              </span>
            )}
          </button>

          <AnimatePresence>
            {bellOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
                className="glass-strong absolute right-0 top-[calc(100%+10px)] w-[320px] overflow-hidden rounded-3xl"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                  <p className="text-[13px] font-semibold text-white">Notificaciones</p>
                  <span className="text-[11px] text-white/35">
                    {pending.length} tareas · {events.length} hitos
                  </span>
                </div>
                <div className="max-h-[340px] overflow-y-auto p-2">
                  {urgent > 0 && (
                    <div className="mb-1 rounded-2xl bg-ember-500/[0.08] px-3.5 py-3">
                      <p className="text-[12.5px] font-medium text-ember-300">
                        {urgent} tareas de prioridad alta
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/40">
                        Requieren decisión antes del cierre del día.
                      </p>
                    </div>
                  )}
                  <p className="px-3.5 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                    Próximos hitos
                  </p>
                  {upcoming.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          KIND_TONE[e.kind],
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] text-white/85">
                          {e.title}
                        </span>
                        <span className="block text-[11px] text-white/35">
                          Día {e.day} · {e.time}
                        </span>
                      </span>
                    </div>
                  ))}
                  <p className="px-3.5 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                    Tareas urgentes
                  </p>
                  {pending
                    .filter((t) => t.priority === "alta")
                    .map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 transition-colors hover:bg-white/[0.04]"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12.5px] text-white/85">
                            {t.title}
                          </span>
                          <span className="block text-[11px] text-white/35">
                            {t.owner} · {t.due}
                          </span>
                        </span>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="ml-1 flex items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.03] py-1 pl-1 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-ember-400 to-ember-600 text-[10px] font-bold text-black">
            {USER.initials}
          </div>
          <span className="hidden text-[12.5px] font-medium text-white/70 sm:block">
            {USER.first}
          </span>
        </div>
      </div>
    </header>
  );
}
