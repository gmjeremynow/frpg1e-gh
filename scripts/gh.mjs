/**
 * Greyhawk for 1e FRPG (Table Edition). An optional add-on: enable or disable it in Manage Modules.
 * It registers a cleric class for each Greyhawk Adventures deity, adds a Greyhawk tab to character and NPC
 * sheets, and builds world compendia from the 1983 World of Greyhawk set and Greyhawk Adventures.
 */
import { DEITIES } from "./deities.mjs";
import { clericClasses, GH_CLASS_KEYS } from "./classes.mjs";
import { renderGHTab, rollGaze } from "./sheet-tab.mjs";
import { offerImport, importCompendia } from "./compendia.mjs";

export const MID = "frpg1e-gh";
let API = null;

Hooks.once("frpg1e.init", api => {
  API = api;
  if (!api.hideClasses) { console.error(`${MID} | needs 1e FRPG 0.32.0 or later`); return; }
  for (const [k, d] of Object.entries(clericClasses(api.CLASSES.cleric))) api.registerClass(k, d);
});

Hooks.once("init", () => {
  game.settings.register(MID, "hideCleric", { name: "Deity clerics only", scope: "world", config: true, type: Boolean, default: false,
    hint: "Takes the plain PHB cleric out of the class list, leaving the Greyhawk Adventures deity clerics. Characters already using it keep working.",
    onChange: v => applyLists(v), requiresReload: false });
  game.settings.register(MID, "compendiaVersion", { scope: "world", config: false, type: String, default: "" });
  game.settings.registerMenu(MID, "rebuild", { name: "Greyhawk compendia", label: "Rebuild Greyhawk compendia", icon: "fa-solid fa-book",
    type: class extends foundry.applications.api.ApplicationV2 { render() { importCompendia({ confirm: true }); return this; } }, restricted: true });
  game.greyhawk = { importCompendia, DEITIES, rollGaze };
});

Hooks.once("setup", () => applyLists(game.settings.get(MID, "hideCleric")));
Hooks.once("ready", () => {
  if (!API?.hideClasses) ui.notifications.error("Greyhawk needs 1e FRPG (Table Edition) 0.32.0 or later.", { permanent: true });
  else if (game.user.isGM) offerImport();
});

function applyLists(hide) {
  const api = game.frpg1e?.api;
  if (!api?.hideClasses) return;
  if (hide) api.hideClasses(["cleric"]); else api.showClasses(["cleric"]);
  for (const a of game.actors ?? []) if (["character", "npc"].includes(a.type)) a.sheet?.rendered && a.sheet.render();
}

/** "Lawful Good", "LG", "true neutral" ... -> lg, n ...; null if not recognised. */
export function alignKey(t) {
  const s = String(t ?? "").trim().toLowerCase().replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return null;
  const abbr = { lg: "lg", ln: "ln", le: "le", ng: "ng", n: "n", tn: "n", nn: "n", cg: "cg", cn: "cn", ce: "ce", ne: "ne" };
  if (abbr[s]) return abbr[s];
  const law = /lawful/.test(s) ? "l" : /chaotic/.test(s) ? "c" : "";
  const moral = /good/.test(s) ? "g" : /evil/.test(s) ? "e" : "";
  if (!law && !moral) return /neutral/.test(s) ? "n" : null;
  if (!law) return /neutral/.test(s) ? `n${moral}` : null;
  if (!moral) return /neutral/.test(s) ? `${law}n` : null;
  return law + moral;
}

/* notes on the character: granted powers by level */
Hooks.on("frpg1e.prepareCharacter", sys => {
  for (const c of sys.classInfo ?? []) {
    const d = DEITIES[c.def?.deity];
    if (!d) continue;
    const al = alignKey(sys.details?.alignment);
    if (al && d.cleric.alKeys && !d.cleric.alKeys.includes(al)) sys.settingNotes.push(`Cleric of ${d.name}: alignment must be ${d.cleric.al} (GA p.${d.page}).`);
    if (d.cleric.aex) sys.settingNotes.push(`Cleric of ${d.name}: experience cost ${d.cleric.aexText} (applied to the level table).`);
  }
});

Hooks.on("renderCharacterSheet", (app, element) => renderGHTab(app, element));
export { GH_CLASS_KEYS };
