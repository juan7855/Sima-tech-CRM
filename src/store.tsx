import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

export type ViewId =
  | "inicio"
  | "identidad"
  | "estrategia"
  | "calendario"
  | "tareas";

export type Priority = "alta" | "media" | "baja";

export type Task = {
  id: string;
  title: string;
  detail: string;
  owner: string;
  due: string;
  priority: Priority;
  done: boolean;
};

export type KanbanCard = {
  id: string;
  title: string;
  tag: string;
  column: string;
  progress: number;
  owner: string;
};

export type CalendarEvent = {
  id: string;
  day: number;
  month: number;
  year: number;
  time: string;
  title: string;
  kind: "lanzamiento" | "contenido" | "reunion" | "campana" | "entrega";
};

/* ------------------------------------------------------------------ */
/*  Datos base                                                        */
/* ------------------------------------------------------------------ */

const OWNERS = ["Juan", "Elena", "Mateo", "Lucía", "Sofía"];

export const IDENTITY = {
  brand: "Sima Tech",
  claim: "Marketing que convierte señales en resultados.",
  intro:
    "Sima Tech es el estudio de performance que traduce datos en decisiones y decisiones en crecimiento. Operamos con una sola regla: claridad antes que ruido.",
  mission:
    "Diseñar sistemas de crecimiento medibles para marcas que quieren escalar sin perder identidad.",
  vision:
    "Ser el command center de referencia en Latinoamérica para equipos de marketing que toman decisiones con datos en tiempo real.",
  values: [
    {
      icon: "compass",
      title: "Claridad",
      text: "Una idea, una pantalla, una acción. Si no se entiende en 3 segundos, se rediseña.",
    },
    {
      icon: "pulse",
      title: "Rigor",
      text: "Cada afirmación tiene un número detrás. Cada número, una fuente.",
    },
    {
      icon: "spark",
      title: "Oficio",
      text: "Detalle obsesivo en el píxel y en la palabra. Lo premium está en el acabado.",
    },
    {
      icon: "shield",
      title: "Confianza",
      text: "Transparencia total con el cliente: mismos datos, misma verdad.",
    },
  ],
  personality: ["Estratégica", "Precisa", "Sofisticada", "Directa"],
  tone: {
    si: ["Voz activa", "Datos concretos", "Frases cortas", "Español neutro"],
    no: ["Promesas vacías", "Anglicismos innecesarios", "Mayúsculas de relleno", "Urgencia falsa"],
  },
  palette: [
    { name: "Ink", hex: "#06060A", use: "Fondo base" },
    { name: "Ember", hex: "#FF7A18", use: "Acento y acción" },
    { name: "Ámbar", hex: "#FFA23A", use: "Degradados" },
    { name: "Hueso", hex: "#F4F4F6", use: "Texto" },
    { name: "Signal", hex: "#3B82F6", use: "Datos" },
  ],
  typography: [
    { name: "Inter", role: "Texto y UI", detail: "300 · 400 · 600" },
    { name: "Inter Tight", role: "Titulares", detail: "600 · tracking -3%" },
  ],
};

export const STRATEGY = {
  quarter: "Q3 · 2026",
  objectives: [
    {
      id: "o1",
      title: "Elevar el pipeline cualificado",
      metric: "MQL → SQL",
      current: 68,
      target: 92,
      unit: "%",
      owner: "Elena",
    },
    {
      id: "o2",
      title: "Reducir el coste por adquisición",
      metric: "CAC",
      current: 41,
      target: 32,
      unit: "USD",
      owner: "Mateo",
    },
    {
      id: "o3",
      title: "Consolidar la autoridad de marca",
      metric: "Share of voice",
      current: 24,
      target: 35,
      unit: "%",
      owner: "Juan",
    },
  ],
  funnel: [
    { stage: "Atracción", value: 128400, conversion: 100, note: "Alcance único" },
    { stage: "Captación", value: 24800, conversion: 19.3, note: "Leads" },
    { stage: "Nutrición", value: 9120, conversion: 36.8, note: "Leads activos" },
    { stage: "Conversión", value: 1486, conversion: 16.3, note: "Clientes" },
    { stage: "Fidelización", value: 1120, conversion: 75.3, note: "Retención" },
  ],
  channels: [
    { name: "LinkedIn Ads", share: 32, roi: 4.1, trend: 12 },
    { name: "Performance Meta", share: 27, roi: 3.4, trend: 8 },
    { name: "SEO & Contenido", share: 21, roi: 5.6, trend: 22 },
    { name: "Email & CRM", share: 12, roi: 6.2, trend: 5 },
    { name: "Partnerships", share: 8, roi: 2.8, trend: -3 },
  ],
  bets: [
    {
      title: "Funnel «Señal»",
      text: "Nuevo embudo de conversión con scoring dinámico y secuencias por intención.",
      status: "En curso",
    },
    {
      title: "Hub de contenidos",
      text: "Biblioteca de activos por etapa con distribución multicanal automatizada.",
      status: "Diseño",
    },
    {
      title: "Modelo de atribución",
      text: "Passo a data-driven: medición incremental sobre inversión por canal.",
      status: "Investigación",
    },
  ],
};

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const now = new Date();
const YEAR = now.getFullYear();
const MONTH = now.getMonth();
const TODAY = now.getDate();

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "e1",
    day: clampDay(TODAY + 1),
    month: MONTH,
    year: YEAR,
    time: "09:30",
    title: "Kickoff campaña Q3",
    kind: "campana",
  },
  {
    id: "e2",
    day: clampDay(TODAY + 2),
    month: MONTH,
    year: YEAR,
    time: "11:00",
    title: "Revisión de creatividades",
    kind: "reunion",
  },
  {
    id: "e3",
    day: clampDay(TODAY + 4),
    month: MONTH,
    year: YEAR,
    time: "16:00",
    title: "Lanzamiento landing «Señal»",
    kind: "lanzamiento",
  },
  {
    id: "e4",
    day: clampDay(TODAY + 6),
    month: MONTH,
    year: YEAR,
    time: "10:00",
    title: "Newsletter mensual",
    kind: "contenido",
  },
  {
    id: "e5",
    day: clampDay(TODAY + 9),
    month: MONTH,
    year: YEAR,
    time: "18:00",
    title: "Entrega informe de resultados",
    kind: "entrega",
  },
  {
    id: "e6",
    day: clampDay(TODAY - 3),
    month: MONTH,
    year: YEAR,
    time: "12:00",
    title: "Workshop de marca",
    kind: "reunion",
  },
];

function clampDay(day: number) {
  const total = new Date(YEAR, MONTH + 1, 0).getDate();
  if (day > total) return day - total;
  if (day < 1) return total + day;
  return day;
}

export const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    title: "Aprobar copy del embudo «Señal»",
    detail: "Revisar 3 variantes de subject y CTA con el equipo de growth.",
    owner: "Elena",
    due: "Hoy · 17:00",
    priority: "alta",
    done: false,
  },
  {
    id: "t2",
    title: "Cerrar brief de la campaña Q3",
    detail: "Definir audiencias, presupuesto y KPIs por canal.",
    owner: "Juan",
    due: "Mañana",
    priority: "alta",
    done: false,
  },
  {
    id: "t3",
    title: "Auditar velocidad de la landing",
    detail: "Objetivo: LCP < 2.0s en móvil.",
    owner: "Mateo",
    due: "Jueves",
    priority: "media",
    done: false,
  },
  {
    id: "t4",
    title: "Actualizar manual de marca",
    detail: "Incorporar la paleta ámbar y las nuevas reglas tonales.",
    owner: "Lucía",
    due: "Viernes",
    priority: "media",
    done: false,
  },
  {
    id: "t5",
    title: "Configurar alertas de atribución",
    detail: "Slack #growth con alertas de CAC semanal.",
    owner: "Sofía",
    due: "Lunes",
    priority: "baja",
    done: false,
  },
  {
    id: "t6",
    title: "Enviar informe de julio",
    detail: "Informe ejecutivo con 3 insights y 1 recomendación.",
    owner: "Juan",
    due: "Completado",
    priority: "media",
    done: true,
  },
];

export const KANBAN_COLUMNS = [
  { id: "idea", title: "Ideas", hint: "Backlog" },
  { id: "curso", title: "En curso", hint: "Esta semana" },
  { id: "revision", title: "En revisión", hint: "Esperando feedback" },
  { id: "hecho", title: "Logrado", hint: "Cerrado" },
];

export const INITIAL_CARDS: KanbanCard[] = [
  {
    id: "k1",
    title: "Serie de videos «Señal»",
    tag: "Contenido",
    column: "idea",
    progress: 10,
    owner: "Lucía",
  },
  {
    id: "k2",
    title: "Rebrand del dashboard de cliente",
    tag: "Producto",
    column: "idea",
    progress: 0,
    owner: "Mateo",
  },
  {
    id: "k3",
    title: "Optimizar formulario de demo",
    tag: "CRO",
    column: "curso",
    progress: 65,
    owner: "Elena",
  },
  {
    id: "k4",
    title: "Secuencia de email · 5 pasos",
    tag: "CRM",
    column: "curso",
    progress: 40,
    owner: "Sofía",
  },
  {
    id: "k5",
    title: "Landing de la campaña Q3",
    tag: "Web",
    column: "revision",
    progress: 85,
    owner: "Mateo",
  },
  {
    id: "k6",
    title: "Guía de tono de marca",
    tag: "Marca",
    column: "hecho",
    progress: 100,
    owner: "Juan",
  },
];

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

type StoreValue = {
  owners: string[];
  tasks: Task[];
  cards: KanbanCard[];
  events: CalendarEvent[];
  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "done">) => void;
  removeTask: (id: string) => void;
  moveCard: (id: string, column: string) => void;
  addCard: (card: Omit<KanbanCard, "id">) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  removeEvent: (id: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

let counter = 100;
const uid = (prefix: string) => `${prefix}${++counter}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [cards, setCards] = useState<KanbanCard[]>(INITIAL_CARDS);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addTask = useCallback((task: Omit<Task, "id" | "done">) => {
    setTasks((prev) => [{ ...task, id: uid("t"), done: false }, ...prev]);
  }, []);

  const moveCard = useCallback((id: string, column: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              column,
              progress: column === "hecho" ? 100 : c.progress,
            }
          : c,
      ),
    );
  }, []);

  const addCard = useCallback((card: Omit<KanbanCard, "id">) => {
    setCards((prev) => [...prev, { ...card, id: uid("k") }]);
  }, []);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    setEvents((prev) => [...prev, { ...event, id: uid("e") }]);
  }, []);

  const removeEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      owners: OWNERS,
      tasks,
      cards,
      events,
      toggleTask,
      addTask,
      removeTask,
      moveCard,
      addCard,
      addEvent,
      removeEvent,
    }),
    [
      tasks,
      cards,
      events,
      toggleTask,
      addTask,
      removeTask,
      moveCard,
      addCard,
      addEvent,
      removeEvent,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Utilidades compartidas                                             */
/* ------------------------------------------------------------------ */

export const MONTHS = MONTH_NAMES;
export const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function greetingForHour(hour: number) {
  if (hour < 6) return "Buenas noches";
  if (hour < 13) return "Buenos días";
  if (hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

export const fmtNumber = (n: number) =>
  new Intl.NumberFormat("es-ES").format(Math.round(n));
