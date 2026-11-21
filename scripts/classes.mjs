/** One cleric class per Greyhawk Adventures deity, built on the PHB cleric (GA p.4-19). */
import { DEITIES } from "./deities.mjs";

/** Minimum XP per level with the extra cost applied to the XP each level needs (from `from` level on). */
export function scaledXP(base, step, aex, from = 2) {
  const xp = base.map((v, i) => (i === 0 || i + 1 < from || !aex ? v : Math.round((v - 1) * (1 + aex)) + 1));
  return { xp, xpStep: aex ? Math.round(step * (1 + aex)) : step };
}

export function clericClasses(cleric) {
  const { label, setting, ...base } = cleric;
  const out = {};
  for (const [k, d] of Object.entries(DEITIES)) {
    const c = d.cleric;
    const { xp, xpStep } = scaledXP(cleric.xp, cleric.xpStep, c.aex, c.aexFrom ?? 2);
    out[`gh_${k}`] = { ...base, label: `Cleric of ${d.name} (GA)`, as: "cleric", source: "GA", deity: k, xp, xpStep,
      spells: [{ list: "cleric", progression: "cleric" }] };
  }
  return out;
}
export const GH_CLASS_KEYS = Object.keys(DEITIES).map(k => `gh_${k}`);
