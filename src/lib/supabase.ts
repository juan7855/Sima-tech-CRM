import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** Cliente de Supabase; es null si faltan las variables de entorno (la app usa datos locales). */
export const supabase = url && key ? createClient(url, key) : null;
