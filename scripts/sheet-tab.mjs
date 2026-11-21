/** Greyhawk tab on the character and NPC sheets: the deity and the powers it grants its clerics (GA p.4-19). */
import { DEITIES, ulaaFoeBonus, pholtusRank } from "./deities.mjs";

const MID = "frpg1e-gh";
const esc = s => foundry.utils.escapeHTML ? foundry.utils.escapeHTML(String(s ?? "")) : String(s ?? "");
const box = (title, body) => `<div class="box"><h3 class="box-title">${title}</h3>${body}</div>`;
const ord = n => `${n}${[, "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10] ?? "th"}`;

export function renderGHTab(app, element) {
  const root = element instanceof HTMLElement ? element : element?.[0] ?? app.element;
  const actor = app.actor ?? app.document;
  if (!root || !actor || !["character", "npc"].includes(actor.type)) return;
  const tabs = root.querySelector(".sheet-tabs");
  const scroll = root.querySelector(".tab-scroll");
  root.querySelector(".tab-body[data-tab='gh']")?.remove();
  tabs?.querySelector("[data-tab='gh']")?.remove();
  const html = tabHTML(actor);
  if (!tabs || !scroll || !html) return;
  const btn = document.createElement("button");
  btn.type = "button"; btn.dataset.action = "sheetTab"; btn.dataset.tab = "gh"; btn.textContent = "Greyhawk";
  tabs.append(btn);
  const sec = document.createElement("section");
  sec.className = "tab-body gh-tab"; sec.dataset.tab = "gh";
  sec.innerHTML = html;
  scroll.append(sec);
  if (app._tab === "gh") { btn.classList.add("active"); sec.classList.add("active"); }
  wire(sec, actor);
}

export function tabHTML(actor) {
  const s = actor.system, flags = actor.flags?.[MID] ?? {};
  const out = [];
  for (const c of s.classInfo ?? []) {
    const key = c.def?.deity ?? String(c.key ?? "").replace(/^gh_/, "");
    const d = DEITIES[key];
    if (!d || !String(c.key).startsWith("gh_")) continue;
    const L = Math.max(1, c.level ?? 1), cl = d.cleric;
    const lines = [];
    for (const [lv, t] of d.specials) lines.push(`<li class="${L >= lv ? "" : "gh-later"}">${L >= lv ? "" : `<em>From ${ord(lv)} level:</em> `}${esc(t)}</li>`);
    const extra = [];
    if (d.orders) {
      const o = d.orders[flags.order];
      extra.push(`<label><span>Order</span><select data-gh-flag="order"><option value=""></option>${Object.entries(d.orders).map(([k, v]) => `<option value="${k}" ${k === flags.order ? "selected" : ""}>${esc(v.label)}</option>`).join("")}</select></label>`);
      if (o) extra.push(`<p><strong>${esc(o.label)}:</strong> ${esc(o.note)} Raiment: ${esc(o.ra)}. ${L >= o.special[0] ? "" : `<em>From ${ord(o.special[0])} level:</em> `}${esc(o.special[1])}</p>`);
      else extra.push(`<p class="hint">The three orders: ${Object.values(d.orders).map(o => `${o.label} (${ord(o.special[0])} level: ${o.special[1]})`).map(esc).join("; ")}.</p>`);
    }
    if (d.lost) extra.push(`<p>Avoid getting lost outdoors: <strong>${35 + (L - 1)}%</strong>.</p>`);
    if (d.disease) extra.push(`<p>Immunity to diseases and slimes: <strong>${20 + 2 * (L - 1)}%</strong>.${L >= 5 ? ` Hypnotism at ${ord(L - 2)} level ability.` : ""}</p>`);
    if (d.foe) extra.push(`<label class="gh-wide"><span>Chosen foe (one kind of creature)</span><input type="text" data-gh-flag="foe" value="${esc(flags.foe ?? "")}"></label><p>Melee damage against the foe: <strong>+${ulaaFoeBonus(L)}</strong>.</p>`);
    if (key === "pholtus") extra.push(`<p>Rank: <strong>${pholtusRank(L)}</strong>.</p>`);
    if (key === "ehlonna") extra.push(`<label class="gh-wide"><span>Plant species in the cleric's ward</span><input type="text" data-gh-flag="plantWard" value="${esc(flags.plantWard ?? "")}"></label>`);
    if (d.gaze) {
      const g = flags.gazeLevel;
      extra.push(`<p>Sleep gaze from: <strong>${g ? `${ord(g)} level` : "not rolled"}</strong>${g && L >= g ? " (gained)" : ""}. <button type="button" class="gh-roll-gaze"><i class="fa-solid fa-dice"></i> Roll 1d4</button></p>`);
    }
    if (d.stronghold) extra.push(`<p>Scrying devices allowed: <strong>${Math.floor((s.abilities?.int?.value ?? 0) / 3.5)}</strong> (one per 3½ points of intelligence; needs a religious stronghold).</p>`);
    out.push(box(`Cleric of ${esc(d.name)} ${L} (GA p.${d.page})`, `
      <p><strong>${esc(d.name)}</strong>, ${esc(d.status)}. ${esc(d.soc)}. Symbol: ${esc(d.sy)}. Color: ${esc(d.cr)}. Plane: ${esc(d.pn)}.</p>
      <table class="gh-table">
        <tr><th>Alignment</th><td>${esc(cl.al)}</td></tr>
        <tr><th>Raiment</th><td>${esc(cl.ra)}</td></tr>
        <tr><th>Extra XP</th><td>${esc(cl.aexText)}</td></tr>
        <tr><th>Weapons</th><td>${esc(cl.wpn)}${cl.wpn.includes("*") ? ` <span class="hint">(* must be proficient at 1st level)</span>` : ""}</td></tr>
        <tr><th>Spheres</th><td>${esc(cl.sph)} <span class="hint">(optional rule)</span></td></tr>
        <tr><th>Additional spells</th><td>${cl.add.map(esc).join(", ")}</td></tr>
      </table>
      ${lines.length ? `<ul class="gh-specials">${lines.join("")}</ul>` : ""}
      ${extra.join("")}
      ${d.specialNote ? `<p class="hint">${esc(d.specialNote)}</p>` : ""}
      <p class="hint">"Standard" weapons are the PHB cleric's. The deity's additional spells and the avatar are in the Greyhawk compendia.</p>`));
  }
  out.push(zeroLevelBox(actor, flags));
  return out.join("");
}

/** GA Appendix 1: zero-level characters (aptitude points and alignment tendency). */
const tendency = (v, lo, mid, hi) => (v === null || v === undefined || v === "" ? "" : Number(v) <= 5 ? lo : Number(v) >= 15 ? hi : mid);
function zeroLevelBox(actor, flags) {
  const z = flags.zero ?? {};
  if (!z.on) return box("Zero-level character (GA p.117)", `<p class="hint">GA Appendix 1 lets characters start below 1st level, building their abilities with aptitude points.</p>
    <button type="button" class="gh-zero-on"><i class="fa-solid fa-seedling"></i> Track as a zero-level character</button>`);
  const total = Number(z.ap ?? 0), spent = Number(z.spent ?? 0);
  const morality = tendency(z.good, "Evil", "Neutral", "Good"), ethics = tendency(z.law, "Chaotic", "Neutral", "Lawful");
  return box("Zero-level character (GA p.117)", `
    <div class="gh-grid">
      <label><span>Aptitude points</span><input type="number" data-gh-zero="ap" value="${z.ap ?? ""}"></label>
      <button type="button" class="gh-zero-roll"><i class="fa-solid fa-dice"></i> Roll 90 + 1d20</button>
      <label><span>Spent</span><input type="number" data-gh-zero="spent" value="${z.spent ?? ""}"></label>
      <span class="gh-left">Left: <strong>${total - spent}</strong></span>
    </div>
    <div class="gh-grid">
      <label><span>Law/chaos score</span><input type="number" data-gh-zero="law" value="${z.law ?? 10}"></label>
      <label><span>Good/evil score</span><input type="number" data-gh-zero="good" value="${z.good ?? 10}"></label>
      <span class="gh-left">Tendency: <strong>${ethics === "Neutral" && morality === "Neutral" ? "True neutral" : `${ethics} ${morality}`}</strong></span>
    </div>
    <p class="hint">Start with every ability at 3 and 3 hit points. Once a game week, 1 to 8 AP may raise one ability or the hit points (never above the racial maximum, 18, or 18 hit points; no exceptional strength). Zero-level characters gain no experience, and spells and magic treat them as true neutral; the DM moves the two alignment scores (1-20, 10 in the middle; 5 or less and 15 or more set the tendency). Hit points are rerolled on reaching 1st level (GA p.117-118). The rest of the appendix (skills, proficiencies, joining a class) is in the Zero-Level Characters journal (Running the Game folder).</p>
    <button type="button" class="gh-zero-off">Stop tracking</button>`);
}

function wire(sec, actor) {
  sec.querySelectorAll("[data-gh-flag]").forEach(el => el.addEventListener("change", ev => {
    ev.stopPropagation();
    actor.setFlag(MID, el.dataset.ghFlag, el.value);
  }));
  sec.querySelector(".gh-roll-gaze")?.addEventListener("click", () => rollGaze(actor));
  sec.querySelectorAll("[data-gh-zero]").forEach(el => el.addEventListener("change", ev => {
    ev.stopPropagation();
    actor.setFlag(MID, `zero.${el.dataset.ghZero}`, el.value === "" ? null : Number(el.value));
  }));
  sec.querySelector(".gh-zero-on")?.addEventListener("click", () => actor.setFlag(MID, "zero", { on: true, law: 10, good: 10 }));
  sec.querySelector(".gh-zero-off")?.addEventListener("click", () => actor.setFlag(MID, "zero.on", false));
  sec.querySelector(".gh-zero-roll")?.addEventListener("click", async () => {
    const roll = await new Roll("90 + 1d20").evaluate();
    await actor.setFlag(MID, "zero.ap", roll.total);
    ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), rolls: [roll], content: `<div class="frpg1e-card"><header class="card-head"><div><div class="card-title">${esc(actor.name)}: aptitude points</div><div class="card-sub">Zero-level character (GA p.117)</div></div></header><div class="roll-line"><span class="adnd-big">${roll.total}</span></div></div>` });
  });
}

/** Ralishaz: the level the sleep gaze is gained, 1d4 → 3rd to 6th (GA p.18). */
export async function rollGaze(actor) {
  const roll = await new Roll("1d4").evaluate();
  const lv = roll.total + 2;
  await actor.setFlag(MID, "gazeLevel", lv);
  return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), rolls: [roll],
    content: `<div class="frpg1e-card"><header class="card-head"><div><div class="card-title">${esc(actor.name)}: sleep gaze</div><div class="card-sub">Cleric of Ralishaz (GA p.18)</div></div></header><div class="roll-line"><span class="adnd-big">${roll.total}</span></div><p>Gains the sleep gaze at ${ord(lv)} level.</p></div>` });
}
