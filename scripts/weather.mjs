/** Greyhawk weather generator (Glossography p.18-25). Opens a dialog, rolls one or more days, and whispers a report to the GM. */
import { MONTHS, TERRAIN, PRECIP, PRECIP_NOTES, SPECIAL, SPECIAL_NOTES, RECORD, RECORD_DAYS, CAUSE, DIRECTIONS, CHILL_TEMPS, CHILL, HIGH_WIND, HEAT } from "./weather-data.mjs";

const MID = "frpg1e-gh";
const esc = s => foundry.utils.escapeHTML ? foundry.utils.escapeHTML(String(s ?? "")) : String(s ?? "");

/* Dice: "NdM+K", "NdM-K", "½dM", "¼dM", or a plain number. Returns { total, text }. */
export function dice(f) {
  const s = String(f).trim();
  if (/^-?\d+$/.test(s)) return { total: Number(s), text: s };
  const m = s.match(/^([½¼])?(\d*)d(\d+)([+-]\d+)?$/);
  if (!m) throw new Error(`Greyhawk weather: bad dice "${f}"`);
  const n = Number(m[2] || 1), sides = Number(m[3]), mod = Number(m[4] || 0);
  const rolls = Array.from({ length: n }, () => Math.ceil(CONFIG.Dice.randomUniform() * sides));
  let total = rolls.reduce((a, b) => a + b, 0);
  if (m[1] === "½") total /= 2; else if (m[1] === "¼") total /= 4;
  total += mod;
  return { total, text: `${s} = ${total}` };
}
const d100 = () => dice("1d100").total;
const pick = (table, r) => table.find(([hi]) => r <= hi);
const maxOf = f => { const m = String(f).match(/^(\d*)d(\d+)([+-]\d+)?$/); return m ? Number(m[1] || 1) * Number(m[2]) + Number(m[3] || 0) : 0; };
const fmt = n => (Math.round(n * 10) / 10).toString();
const dur = (v, unit) => unit === "days" ? `${fmt(v)} day${v === 1 ? "" : "s"} (${fmt(v * 24)} hours)` : `${fmt(v)} ${unit}`;

function shiftTime(t, minutes) {
  const [h, m] = t.split(":").map(Number);
  let x = h * 60 + m + minutes;
  x = ((x % 720) + 720) % 720;
  const hh = Math.floor(x / 60) || 12;
  return `${hh}:${String(x % 60).padStart(2, "0")}`;
}

function chill(temp, wind) {
  if (temp >= 35 || wind < 5) return null;
  const w = Math.min(60, Math.max(5, Math.round(wind / 5) * 5));
  const ti = CHILL_TEMPS.reduce((best, t, i) => Math.abs(t - temp) < Math.abs(CHILL_TEMPS[best] - temp) ? i : best, 0);
  return { feels: CHILL[w][ti], row: w, col: CHILL_TEMPS[ti], off: temp < -20 };
}

/** Is a precipitation type allowed by the day's temperatures and the terrain? min is checked against the high, max against the low. */
function allowed(p, day, terrain) {
  if (p.notIn.includes(day.tkey) || TERRAIN[day.tkey].bar.includes(p.key)) return false;
  if (p.min != null && day.high < p.min) return false;
  if (p.max != null && day.low > p.max) return false;
  return true;
}

function rollPrecipType(day, opts, log) {
  for (let i = 0; i < (opts.reroll ? 10 : 1); i++) {
    const r = d100();
    if (r === 100) return { special: true, roll: r };
    const p = PRECIP.find(x => r <= x.hi);
    if (allowed(p, day)) return { p, roll: r };
    log.push(`Rolled ${r}: ${p.name}, not possible today${opts.reroll ? "; rolled again" : ""}.`);
  }
  return null;
}

function precipEvent(p, day) {
  const T = TERRAIN[day.tkey];
  let d = dice(p.dur).total;
  if (p.fog && T.fogx2) d *= 2;
  const amt = p.amt ? dice(p.amt).total : null;
  return { kind: "precip", p, dur: d, amt, wind: dice(p.wind).total };
}

function specialEvent(day, name) {
  const T = TERRAIN[day.tkey];
  name ??= pick(T.special, d100())[1];
  const s = SPECIAL[name];
  const ev = { kind: "special", name, s, wind: dice(s.wind).total };
  if (s.dur) ev.dur = dice(s.dur).total;
  if (d100() <= 10) ev.cause = pick(CAUSE, d100())[1];
  ev.dir = DIRECTIONS[dice("1d8").total - 1];
  return ev;
}

function rollDay(state, opts, n) {
  const M = MONTHS[opts.month], T = TERRAIN[opts.terrain], log = [];
  const day = { n, tkey: opts.terrain };
  /* temperature */
  let base = M.base;
  if (opts.records) {
    if (state.recordLeft > 0) state.recordLeft--;
    else {
      const r = pick(RECORD, d100());
      state.record = r; state.recordLeft = 0;
      if (r[2] !== 0) state.recordLeft = pick(RECORD_DAYS, dice("1d20").total)[1] - 1;
    }
    if (state.record?.[2]) {
      const k = state.record[2];
      base += k > 0 ? maxOf(M.hi) * k : -maxOf(M.lo) * -k;
      day.record = `${state.record[1]} (base ${base}; ${state.recordLeft} more day${state.recordLeft === 1 ? "" : "s"} after today)`;
    }
  }
  const hi = dice(M.hi), lo = dice(M.lo);
  const lat = -2 * (Math.abs(opts.latitude) - 40);
  const elev = -3 * (opts.elevation / 1000);
  const cur = T.current ? T.current[opts.current] : 0;
  day.high = Math.round(base + hi.total + lat + elev + (T.current ? cur : T.day));
  day.low = Math.round(base - lo.total + lat + elev + (T.current ? cur : T.night));
  day.tempWork = `Base ${base}, high ${hi.text}, low −(${lo.text}); latitude ${lat >= 0 ? "+" : ""}${fmt(lat)}; elevation ${fmt(elev)}; terrain ${T.current ? `${cur} (${opts.current} current)` : `${T.day}/${T.night}`}`;
  /* sky */
  const sr = d100();
  day.sky = sr <= M.sky[0] ? "Clear" : sr <= M.sky[1] ? "Partly cloudy" : "Cloudy";
  /* sun */
  const sh = 2 * (Math.abs(opts.latitude) - 40);
  day.sun = `Sunrise ${shiftTime(M.rise, sh)} a.m., sunset ${shiftTime(M.set, sh)} p.m. (mid-month)`;
  /* precipitation */
  const chance = Math.max(0, M.precip + T.precip);
  const pr = d100();
  day.events = [];
  if (pr > chance) {
    let w = dice("1d20").total - 1, adj = 0;
    if (T.wind === "±5") adj = CONFIG.Dice.randomUniform() < 0.5 ? -5 : 5; else adj = T.wind;
    if (opts.terrain === "mountains") adj += 5 * (opts.elevation / 1000);
    day.wind = Math.max(0, Math.round(w + adj));
    day.precipText = `None (rolled ${pr} against ${chance}%)`;
  } else {
    day.precipText = `Yes (rolled ${pr} against ${chance}%)`;
    let first = rollPrecipType(day, opts, log);
    if (!first) day.precipText += "; cancelled, the rolled type is not possible today";
    else {
      let ev = first.special ? specialEvent(day) : precipEvent(first.p, day);
      day.events.push(ev);
      for (let i = 0; i < 5; i++) {
        if (ev.kind === "special") {
          if (dice("1d100").total <= 1) { ev = { ...specialEvent(day, ev.name), cont: true }; day.events.push(ev); continue; }
          const next = rollPrecipType(day, opts, log);
          if (!next || next.special) break;
          ev = { ...precipEvent(next.p, day), after: true }; day.events.push(ev); continue;
        }
        if (d100() > ev.p.cont) break;
        const shift = dice("1d10").total;
        let idx = PRECIP.indexOf(ev.p);
        if (shift === 1) idx = Math.max(0, idx - 1); else if (shift === 10) idx = Math.min(PRECIP.length - 1, idx + 1);
        const np = PRECIP[idx];
        if (!allowed(np, day)) { log.push(`Continuation changed to ${np.name}, not possible today; it ends.`); break; }
        ev = { ...precipEvent(np, day), cont: true }; day.events.push(ev);
      }
      const last = day.events.at(-1);
      if (last.kind === "precip" && last.p.bow && d100() <= last.p.bow) day.rainbow = true;
      if (last.kind === "special" && last.s.note === 10 && d100() <= 95) day.rainbow = true;
      day.wind = Math.max(...day.events.map(e => e.wind));
    }
  }
  if (day.wind == null) day.wind = Math.max(0, dice("1d20").total - 1);
  /* wind chill, high wind, heat */
  day.chillHigh = chill(day.high, day.wind); day.chillLow = chill(day.low, day.wind);
  day.highWind = [...HIGH_WIND].reverse().find(r => day.wind >= r[0]);
  if (day.high > 75) {
    day.humidity = d100();
    const sum = day.high + day.humidity;
    day.heat = { sum, row: [...HEAT].reverse().find(r => sum >= r[0]) };
  }
  day.log = log;
  return day;
}

function eventHTML(e) {
  const r = e.kind === "precip" ? e.p : e.s;
  const name = e.kind === "precip" ? e.p.name : e.name;
  const label = e.cont ? `Continues as ${name}` : e.after ? `Then ${name}` : name;
  const durTxt = e.dur != null ? dur(e.dur, r.unit) : r.durText;
  const amt = e.kind === "precip" ? (e.amt != null ? `${fmt(e.amt)} inches${r.perDay ? " per day" : ""}` : r.key === "hail" ? "See note" : "—") : r.amt;
  const note = e.kind === "precip" ? PRECIP_NOTES[r.note] : SPECIAL_NOTES[r.note];
  return `<div class="gh-wx-ev"><strong>${esc(label)}</strong>: ${esc(durTxt)}, wind ${e.wind} mph.
    <table class="gh-wx-t"><tr><th>Amount</th><td>${esc(amt)}</td></tr><tr><th>Movement</th><td>${esc(r.move)}</td></tr>
    <tr><th>Vision</th><td>${esc(r.vis)}; infra/ultra ${esc(r.ivis)}</td></tr><tr><th>Tracking</th><td>${esc(r.track)}</td></tr><tr><th>Getting lost</th><td>${esc(r.lost)}</td></tr></table>
    ${note ? `<p class="gh-wx-note">${esc(note)}</p>` : ""}${r.extra ? `<p class="gh-wx-note">${esc(r.extra)}</p>` : ""}
    ${e.cause ? `<p class="gh-wx-note">Cause: ${esc(e.cause)}.</p>` : ""}${e.dir ? `<p class="gh-wx-note">Direction from the party: ${esc(e.dir)}.</p>` : ""}</div>`;
}

function dayHTML(d, opts) {
  const ch = (c, w) => c ? `${w}: feels like ${c.feels}°F${c.off ? " (off the table; coldest column used)" : ""}` : "";
  const chills = [ch(d.chillHigh, "High"), ch(d.chillLow, "Low")].filter(Boolean).join("; ");
  return `<div class="gh-wx-day"><h4>${opts.days > 1 ? `Day ${d.n}` : "Today"}</h4>
    ${d.record ? `<p><strong>${esc(d.record)}</strong></p>` : ""}
    <p><strong>High ${d.high}°F, low ${d.low}°F.</strong> ${esc(d.sky)}. Wind ${d.wind} mph; prevailing winds from the ${[0, 9, 10, 11].includes(opts.month) ? "north and northeast" : "east and southeast"}.</p>
    <p>Precipitation: ${esc(d.precipText)}.</p>
    ${d.events.map(eventHTML).join("")}
    ${d.rainbow ? `<p>A rainbow appears when it ends.</p>` : ""}
    ${chills ? `<p>Wind chill. ${esc(chills)}.</p>` : ""}
    ${d.highWind ? `<p>High winds (${d.highWind[0]}+ mph). Land: ${esc(d.highWind[1])} Sea: ${esc(d.highWind[2])} Air: ${esc(d.highWind[3])} Battle: ${esc(d.highWind[4])}</p>` : ""}
    ${d.heat ? (d.heat.row ? `<p>Heat: humidity ${d.humidity}%, total ${d.heat.sum}. Move ${d.heat.row[1]}, AC ${d.heat.row[2]}, to hit ${d.heat.row[3]}, dexterity ${d.heat.row[4]}, vision ${d.heat.row[5]}, rest ${d.heat.row[6]} per hour, spell failure ${d.heat.row[7]}.${d.heat.sum > 200 ? " Severe sunstroke is possible." : ""}</p>` : `<p>Humidity ${d.humidity}% (total ${d.heat.sum}, no heat effects).</p>`) : ""}
    ${d.log.length ? `<p class="gh-wx-note">${esc(d.log.join(" "))}</p>` : ""}
    <p class="gh-wx-note">${esc(d.tempWork)}. ${esc(d.sun)}.</p></div>`;
}

export async function generate(opts) {
  const state = {}, days = [];
  for (let i = 1; i <= opts.days; i++) days.push(rollDay(state, opts, i));
  const M = MONTHS[opts.month], T = TERRAIN[opts.terrain];
  const content = `<div class="frpg1e-card gh-wx"><header class="card-head"><div><div class="card-title">Greyhawk Weather: ${esc(M.name)}</div>
    <div class="card-sub">${esc(T.label)}, ${Math.abs(opts.latitude)}° ${opts.latitude < 0 ? "S" : "N"}${opts.elevation ? `, ${opts.elevation} ft` : ""} (Glossography p.18-25)</div></div></header>
    ${days.map(d => dayHTML(d, opts)).join("")}</div>`;
  return ChatMessage.create({ content, whisper: opts.public ? [] : ChatMessage.getWhisperRecipients("GM").map(u => u.id), speaker: { alias: "Greyhawk Weather" } });
}

export async function weatherDialog() {
  const last = game.settings.get(MID, "weatherLast") ?? {};
  const opt = (v, l, cur) => `<option value="${v}" ${String(v) === String(cur) ? "selected" : ""}>${esc(l)}</option>`;
  const content = `<div class="gh-wx-form">
    <div class="form-group"><label>Month</label><select name="month">${MONTHS.map((m, i) => opt(i, m.name, last.month ?? 0)).join("")}</select></div>
    <div class="form-group"><label>Latitude (degrees)</label><input type="number" name="latitude" value="${last.latitude ?? 40}" step="0.5"><p class="hint">40 is the baseline (hex row 34 on the right map sheet, 70 on the left). Negative for south of the equator.</p></div>
    <div class="form-group"><label>Terrain</label><select name="terrain">${Object.entries(TERRAIN).map(([k, t]) => opt(k, t.label, last.terrain ?? "plains")).join("")}</select></div>
    <div class="form-group"><label>Elevation (feet)</label><input type="number" name="elevation" value="${last.elevation ?? 0}" step="500"><p class="hint">-3°F per 1,000 feet; in mountains also +5 mph wind per 1,000 feet.</p></div>
    <div class="form-group"><label>Sea current</label><select name="current">${opt("cold", "Cold", last.current)}${opt("warm", "Warm", last.current)}</select><p class="hint">Seacoast and at sea only.</p></div>
    <div class="form-group"><label>Days</label><input type="number" name="days" value="${last.days ?? 1}" min="1" max="14"></div>
    <div class="form-group"><label>Record highs and lows</label><input type="checkbox" name="records" ${last.records ?? true ? "checked" : ""}></div>
    <div class="form-group"><label>Reroll impossible precipitation</label><input type="checkbox" name="reroll" ${last.reroll ?? true ? "checked" : ""}><p class="hint">Off: the day stays dry instead.</p></div>
    <div class="form-group"><label>Show to players</label><input type="checkbox" name="public" ${last.public ? "checked" : ""}></div></div>`;
  const data = await foundry.applications.api.DialogV2.input({ window: { title: "Greyhawk Weather" }, content, ok: { label: "Roll the weather", icon: "fa-solid fa-cloud-sun-rain" }, rejectClose: false });
  if (!data) return;
  const opts = { month: Number(data.month), latitude: Number(data.latitude) || 40, terrain: data.terrain, elevation: Math.max(0, Number(data.elevation) || 0),
    current: data.current, days: Math.min(14, Math.max(1, Math.floor(Number(data.days) || 1))), records: !!data.records, reroll: !!data.reroll,
    public: !!data.public };
  await game.settings.set(MID, "weatherLast", opts);
  return generate(opts);
}
