import { AnimatePresence, motion } from "motion/react";
import { PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";
import { NAV, USER } from "../nav";
import { useStore } from "../store";
import { cn } from "../utils/cn";
import { Logo } from "./Logo";

type Props = {
  active: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({
  active,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: Props) {
  const { tasks, cards } = useStore();
  const pending = tasks.filter((t) => !t.done).length;
  const inProgress = cards.filter((c) => c.column === "curso").length;

  const groups = Array.from(new Set(NAV.map((n) => n.group)));

  const body = (
    <div className="flex h-full flex-col">
      {/* Cabecera */}
      <div
        className={cn(
          "flex h-[72px] shrink-0 items-center gap-3 px-5",
          collapsed && "justify-center px-0",
        )}
      >
        <Logo collapsed={collapsed} />
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Menú principal">
        {groups.map((group) => (
          <div key={group}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
                {group}
              </p>
            )}
            <ul className="space-y-1">
              {NAV.filter((n) => n.group === group).map((item) => {
                const isActive = active === item.id;
                const badge =
                  item.id === "tareas" ? pending : item.id === "estrategia" ? inProgress : 0;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      title={collapsed ? item.label : undefined}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-300",
                        collapsed && "justify-center px-0",
                        isActive ? "text-white" : "text-white/45 hover:text-white/85",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-0 rounded-2xl border border-ember-500/25 bg-gradient-to-r from-ember-500/[0.16] to-ember-500/[0.04]"
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 transition-transform duration-300 group-hover:scale-110",
                          isActive ? "text-ember-400" : "text-current",
                        )}
                      >
                        <item.icon size={18} strokeWidth={1.7} />
                      </span>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="relative z-10 flex-1 text-[13.5px] font-medium tracking-[-0.01em]"
                        >
                          {item.label}
                        </motion.span>
                      )}
                      {!collapsed && badge > 0 && (
                        <span className="relative z-10 rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-semibold text-white/60">
                          {badge}
                        </span>
                      )}
                      {isActive && (
                        <motion.span
                          layoutId="nav-dot"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-ember-500 shadow-[0_0_14px_2px_rgba(255,122,24,0.7)]"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Pie */}
      <div className="shrink-0 space-y-2 p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2.5",
            collapsed && "justify-center border-0 bg-transparent p-0",
          )}
        >
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-ember-400 to-ember-600 text-[12px] font-bold text-black">
              {USER.initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink-950 bg-mint-400" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[13px] font-medium text-white">{USER.name}</p>
              <p className="truncate text-[11px] text-white/35">{USER.role}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => onNavigate("inicio")}
              aria-label="Cerrar sesión"
              className="rounded-xl p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-white/70"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className={cn(
            "hidden w-full items-center gap-3 rounded-2xl px-3 py-2 text-[12px] font-medium text-white/35 transition-colors hover:bg-white/[0.04] hover:text-white/70 lg:flex",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          {!collapsed && "Contraer menú"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Escritorio */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 78 : 264 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="fixed inset-y-0 left-0 z-40 hidden border-r border-white/[0.06] bg-ink-900/70 backdrop-blur-2xl lg:block"
      >
        {body}
      </motion.aside>

      {/* Móvil */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/[0.06] bg-ink-900/90 backdrop-blur-2xl lg:hidden"
            >
              {body}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
