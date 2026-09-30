import { JSDOM } from "jsdom";
import fs from "node:fs";

const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
  url: "http://localhost/", pretendToBeVisual: true, runScripts: "outside-only",
});
const { window } = dom;
for (const k of ["window","document","navigator","HTMLElement","HTMLInputElement","HTMLSelectElement","Element","Node","MutationObserver","DOMParser","SVGElement"]) globalThis[k] = window[k];
globalThis.getComputedStyle = window.getComputedStyle.bind(window);
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
window.matchMedia = (q) => ({ matches:false, media:q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){}, dispatchEvent:()=>false });
globalThis.matchMedia = window.matchMedia;
const errors = [];
console.error = (...a) => errors.push(a.map(String).join(" ").slice(0,200));

window.eval(fs.readFileSync("/tmp/smoke2.js","utf8"));
const wait = (ms) => new Promise(r => setTimeout(r, ms));
await wait(700);
console.log("DBG root:", document.getElementById("root").innerHTML.length, "buttons:", document.querySelectorAll("button").length);

const fire = (el, type) => el.dispatchEvent(new window.MouseEvent(type, { bubbles: true, cancelable: true }));
const click = (el) => { fire(el, "mousedown"); fire(el, "mouseup"); fire(el, "click"); };
const findByText = (sel, re) => [...document.querySelectorAll(sel)].find(e => re.test(e.textContent || ""));
const body = () => document.body.textContent || "";
const results = [];
const check = (name, cond) => results.push(`${cond ? "PASS" : "FAIL"} · ${name}`);
const setValue = (el, v) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(el, v);
  el.dispatchEvent(new window.Event("input", { bubbles: true }));
};

const __el = [...document.querySelectorAll("button")].find(e => /Nuestra/.test(e.textContent||""));
console.log("EL?", !!__el, typeof __el);
// --- Identidad ---
const __f = findByText("button", /Nuestra identidad/);
console.log("FIND?", !!__f, document.querySelectorAll("button").length, /Nuestra identidad/.test("Nuestra identidad"));
click(__f);
await wait(450);
check("Identidad · misión", /Diseñar sistemas de crecimiento/.test(body()));
click(findByText("button", /Ember/));
await wait(250);
check("Identidad · copiar color", /copiado/.test(body()));

// --- Estrategia ---
click(findByText("button", /^Estrategia$/));
await wait(400);
check("Estrategia · objetivos", /Elevar el pipeline cualificado/.test(body()));
click(findByText("button", /Embudo/));
await wait(400);
check("Estrategia · embudo", /Embudo de conversión/.test(body()));
click(findByText("button", /Canales/));
await wait(400);
check("Estrategia · canales", /Reparto de inversión/.test(body()));

// --- Calendario ---
click(findByText("button", /^Calendario$/));
await wait(400);
const before = findByText("h3", /\d{4}/)?.textContent;
click(document.querySelector('button[aria-label="Mes siguiente"]'));
await wait(400);
check("Calendario · cambio de mes", before !== findByText("h3", /\d{4}/)?.textContent);
const evInput = document.querySelector('input[placeholder="Nombre del hito"]');
setValue(evInput, "Hito de prueba");
await wait(150);
click(findByText("button", /Añadir al calendario/));
await wait(400);
check("Calendario · hito añadido", /Hito de prueba/.test(body()));

// --- Tareas ---
click(findByText("button", /Tareas y metas/));
await wait(450);
check("Tareas · tablero", /Tablero de metas/.test(body()));
const taskInput = document.querySelector('input[placeholder="Nueva tarea…"]');
setValue(taskInput, "Revisar informe semanal");
await wait(150);
click(findByText("button", /Añadir/));
await wait(400);
check("Tareas · tarea creada", /Revisar informe semanal/.test(body()));
// completar la primera tarea
const completeBtn = [...document.querySelectorAll('button[aria-label^="Completar"]')][0];
click(completeBtn);
await wait(400);
check("Tareas · completar tarea", /Reabrir/.test(body()));
// mover tarjeta Kanban con los puntos
const moveBtn = [...document.querySelectorAll('button[aria-label="Mover a Logrado"]')][0];
click(moveBtn);
await wait(400);
const logrado = [...document.querySelectorAll("div")].find(d => /Logrado/.test(d.textContent||"") && d.className.includes("rounded-3xl border"));
check("Tareas · mover tarjeta", !!logrado && /Serie de videos/.test(logrado.textContent || ""));

// --- Buscador ---
click(findByText("button", /Buscar/));
await wait(400);
check("Buscador · abierto", /Buscar sección, tarea o hito/.test(body()));

console.log(results.join("\n"));
console.log("errores React:", errors.length);
errors.slice(0,5).forEach(e => console.log("  ERR>", e));
console.log(results.every(r => r.startsWith("PASS")) && errors.length === 0 ? "INTERACCIÓN OK" : "REVISAR");
