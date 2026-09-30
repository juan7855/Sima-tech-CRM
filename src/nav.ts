import {
  CalendarDays,
  Fingerprint,
  LayoutGrid,
  Target,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import type { ViewId } from "./store";

export type NavItem = {
  id: ViewId;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
  group: "Principal" | "Operación";
};

export const NAV: NavItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    short: "Inicio",
    description: "Resumen del día y accesos rápidos",
    icon: LayoutGrid,
    group: "Principal",
  },
  {
    id: "identidad",
    label: "Nuestra identidad",
    short: "Identidad",
    description: "Marca, voz, paleta y tipografía",
    icon: Fingerprint,
    group: "Principal",
  },
  {
    id: "estrategia",
    label: "Estrategia",
    short: "Estrategia",
    description: "Objetivos, embudo y canales",
    icon: Target,
    group: "Operación",
  },
  {
    id: "calendario",
    label: "Calendario",
    short: "Calendario",
    description: "Hitos, campañas y entregas",
    icon: CalendarDays,
    group: "Operación",
  },
  {
    id: "tareas",
    label: "Tareas y metas",
    short: "Tareas",
    description: "Pendientes y tablero Kanban",
    icon: ListChecks,
    group: "Operación",
  },
];

export const USER = {
  name: "Juan Pardo",
  first: "Juan",
  role: "Director de Marketing",
  initials: "JP",
};
