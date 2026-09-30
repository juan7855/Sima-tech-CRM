import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { StoreProvider, type ViewId } from "./store";
import { NAV } from "./nav";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { CommandPalette } from "./components/CommandPalette";
import { AmbientBackground } from "./components/ui";
import { Home } from "./sections/Home";
import { Identity } from "./sections/Identity";
import { Strategy } from "./sections/Strategy";
import { Calendar } from "./sections/Calendar";
import { Tasks } from "./sections/Tasks";

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

function Shell() {
  const [view, setView] = useState<ViewId>("inicio");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const navigate = useCallback((next: ViewId) => {
    setView(next);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const item = NAV.find((n) => n.id === view)!;
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = `${item.label} · Sima Tech Command Center`;
  }, [item.label]);

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />

      <Sidebar
        active={view}
        onNavigate={(id) => navigate(id as ViewId)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className="shell-pad relative"
        style={{ "--pad": collapsed ? "78px" : "264px" } as CSSProperties}
      >
        <Topbar
          active={view}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
        />

        <main ref={mainRef} className="pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {view === "inicio" && <Home onNavigate={navigate} />}
              {view === "identidad" && <Identity />}
              {view === "estrategia" && <Strategy />}
              {view === "calendario" && <Calendar />}
              {view === "tareas" && <Tasks />}
            </motion.div>
          </AnimatePresence>

          <footer className="mx-auto mt-6 max-w-[1180px] px-4 pb-10 sm:px-6 lg:px-9">
            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.05] pt-6 sm:flex-row">
              <p className="text-[11.5px] text-white/25">
                Sima Tech · Command Center · v3.2 — equipo de marketing
              </p>
              <p className="text-[11.5px] text-white/25">
                Menos ruido, mejor señal.
              </p>
            </div>
          </footer>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
}
