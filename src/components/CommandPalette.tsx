import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CornerDownLeft, Search } from "lucide-react";
import { LogoMark } from "./Logo";
import { NAV, USER } from "../nav";
import { useStore, type ViewId } from "../store";
import { cn } from "../utils/cn";

type Command = {
  id: string;
  label: string;
  hint: string;
  group: string;
  run: () => void;
};

export function CommandPalette({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: ViewId) => void;
}) {
  const { tasks, events } = useStore();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = NAV.map((n) => ({
      id: `nav-${n.id}`,
      label: n.label,
      hint: n.description,
      group: "Secciones",
      run: () => onNavigate(n.id),
    }));

    const taskCmds: Command[] = tasks
      .filter((t) => !t.done)
      .map((t) => ({
        id: `task-${t.id}`,
        label: t.title,
        hint: `Tarea · ${t.owner} · ${t.due}`,
        group: "Tareas pendientes",
        run: () => onNavigate("tareas"),
      }));

    const eventCmds: Command[] = events.slice(0, 5).map((e) => ({
      id: `ev-${e.id}`,
      label: e.title,
      hint: `Calendario · día ${e.day} · ${e.time}`,
      group: "Próximos hitos",
      run: () => onNavigate("calendario"),
    }));

    return [...nav, ...taskCmds, ...eventCmds];
  }, [tasks, events, onNavigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.slice(0, 8);
    return commands
      .filter(
        (c) =>
          c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [commands, query]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[cursor];
        if (cmd) {
          cmd.run();
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, cursor, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/65 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Buscador"
            className="glass-strong relative w-full max-w-xl overflow-hidden rounded-[26px]"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
              <Search size={17} className="text-white/35" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar sección, tarea o hito…"
                className="w-full bg-transparent text-[15px] text-white placeholder:text-white/30 focus:outline-none"
              />
              <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40">
                ESC
              </kbd>
            </div>

            <ul className="max-h-[46vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-4 py-8 text-center text-[13px] text-white/35">
                  Sin resultados para «{query}»
                </li>
              )}
              {filtered.map((cmd, i) => (
                <li key={cmd.id}>
                  <button
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => {
                      cmd.run();
                      onClose();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-colors",
                      i === cursor ? "bg-white/[0.06]" : "hover:bg-white/[0.04]",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        i === cursor ? "bg-ember-400" : "bg-white/15",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] text-white">
                        {cmd.label}
                      </span>
                      <span className="block truncate text-[11.5px] text-white/35">
                        {cmd.hint}
                      </span>
                    </span>
                    {i === cursor && (
                      <CornerDownLeft size={14} className="shrink-0 text-white/30" />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3 text-[11px] text-white/30">
              <span>{filtered.length} resultados</span>
              <span className="flex items-center gap-1.5">
                <LogoMark size={22} glow={false} />
                Sesión de {USER.first} · Sima Tech
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
