/** Weather data from the Glossography (p.18-25). Figures as printed; shared by the weather generator and the roll tables. */

/* Baseline Data Chart, 40 degrees north. hi/lo: dice added to / subtracted from the base temperature.
   sky: [last clear, last partly cloudy] on d100; the rest is cloudy. */
export const MONTHS = [
  { name: "Fireseek", base: 32, hi: "1d10", lo: "1d20", sky: [23, 50], precip: 46, rise: "7:21", set: "5:01" },
  { name: "Readying", base: 34, hi: "1d6+4", lo: "1d10+4", sky: [25, 50], precip: 40, rise: "6:55", set: "5:36" },
  { name: "Coldeven", base: 42, hi: "1d8+4", lo: "1d10+4", sky: [27, 54], precip: 44, rise: "6:12", set: "6:09" },
  { name: "Planting", base: 52, hi: "1d10+6", lo: "1d8+4", sky: [20, 55], precip: 42, rise: "5:24", set: "6:39" },
  { name: "Flocktime", base: 63, hi: "1d10+6", lo: "1d10+6", sky: [20, 53], precip: 42, rise: "4:45", set: "7:10" },
  { name: "Wealsun", base: 71, hi: "1d8+8", lo: "1d6+6", sky: [20, 60], precip: 36, rise: "4:32", set: "7:32" },
  { name: "Reaping", base: 77, hi: "1d6+4", lo: "1d6+6", sky: [22, 62], precip: 33, rise: "4:45", set: "7:29" },
  { name: "Goodmonth", base: 75, hi: "1d4+6", lo: "1d6+6", sky: [25, 60], precip: 33, rise: "5:13", set: "6:57" },
  { name: "Harvester", base: 68, hi: "1d8+6", lo: "1d8+6", sky: [33, 54], precip: 33, rise: "5:42", set: "6:10" },
  { name: "Patchwall", base: 57, hi: "1d10+5", lo: "1d10+5", sky: [35, 60], precip: 36, rise: "6:12", set: "5:21" },
  { name: "Ready'reat", base: 46, hi: "1d10+6", lo: "1d10+4", sky: [20, 50], precip: 40, rise: "6:46", set: "4:45" },
  { name: "Sunsebb", base: 33, hi: "1d8+5", lo: "1d20", sky: [25, 50], precip: 43, rise: "7:19", set: "4:36" }
];

/* Terrain Effects Table. day/night: temperature change to the high/low. wind: mph change when there is no precipitation.
   special: d100 [upper bound, phenomenon]. bar: precipitation types not allowed (table column plus the terrain notes). */
export const TERRAIN = {
  hills: { label: "Rough terrain or hills", precip: 0, day: 0, night: 0, wind: "±5", special: [[80, "Wind storm"], [100, "Earthquake"]], bar: [] },
  forest: { label: "Forest", precip: 0, day: -5, night: -5, wind: -5, special: [[80, "Quicksand"], [100, "Earthquake"]], bar: [] },
  jungle: { label: "Jungle", precip: 10, day: 5, night: 5, wind: -10, special: [[5, "Volcano"], [60, "Rain forest downpour"], [80, "Quicksand"], [100, "Earthquake"]], bar: [] },
  swamp: { label: "Swamp or marsh", precip: 5, day: 5, night: 5, wind: -5, special: [[25, "Quicksand"], [80, "Sun shower"], [100, "Earthquake"]], bar: [] },
  coldmarsh: { label: "Swamp or marsh (Cold Marshes)", precip: 5, day: -5, night: -5, wind: -5, special: [[25, "Quicksand"], [80, "Sun shower"], [100, "Earthquake"]], bar: [] },
  dust: { label: "Dust", precip: -25, day: 10, night: -10, wind: 0, special: [[40, "Flash flood"], [70, "Dust storm"], [85, "Tornado"], [100, "Earthquake"]], bar: ["fogH", "fogL", "gale", "hurricane"] },
  plains: { label: "Plains", precip: 0, day: 0, night: 0, wind: 5, special: [[50, "Tornado"], [100, "Earthquake"]], bar: ["monsoon", "tropical"] },
  desert: { label: "Desert", precip: -30, day: 10, night: -10, wind: 5, special: [[25, "Flash flood"], [50, "Sand storm"], [65, "Oasis"], [85, "Mirage oasis"], [100, "Earthquake"]], bar: ["fogH", "fogL", "mist", "blizzardH", "blizzard", "monsoon", "tropical", "gale", "hurricane"] },
  mountains: { label: "Mountains", precip: 0, day: 0, night: 0, wind: 0, special: [[20, "Wind storm"], [50, "Rock avalanche"], [75, "Snow avalanche"], [80, "Volcano"], [100, "Earthquake"]], bar: [] },
  coast: { label: "Seacoast (within 2 hexes of the coast)", precip: 5, current: { cold: -5, warm: 5 }, wind: 5, special: [[80, "Earthquake"], [94, "Tsunami"], [100, "Undersea volcano"]], bar: [], fogx2: true },
  sea: { label: "At sea (more than 1 hex from the coast)", precip: 15, current: { cold: -10, warm: 5 }, wind: 10, special: [[20, "Tsunami"], [40, "Undersea volcano"], [100, "Undersea earthquake"]], bar: [], fogx2: true }
};

/* Precipitation Occurrence Table joined with the Standard Weather Table, in table order (up one line = lower index).
   min/max: temperature required. notIn: terrain keys from the "Not allowed in" column. */
export const PRECIP = [
  { key: "blizzardH", hi: 2, name: "Heavy blizzard", max: 10, cont: 5, bow: 0, notIn: ["desert"], amt: "2d10+10", dur: "3d8", unit: "hours", move: "F: x⅛; H: x¼; C: no", vis: "2' radius", ivis: "No", track: "No", lost: "+50%", wind: "6d8+40", note: 1 },
  { key: "blizzard", hi: 5, name: "Blizzard", max: 20, cont: 10, bow: 0, notIn: ["desert"], amt: "2d8+8", dur: "3d10", unit: "hours", move: "x¼ (all)", vis: "10' radius", ivis: "x½", track: "+40%", lost: "+35%", wind: "3d8+36", note: 2 },
  { key: "snowH", hi: 10, name: "Heavy snowstorm", max: 25, cont: 20, bow: 0, notIn: [], amt: "2d8+2", dur: "4d6", unit: "hours", move: "x½ (all)", vis: "x½", ivis: "x½", track: "-25%", lost: "+20%", wind: "3d10", note: 3 },
  { key: "snowL", hi: 20, name: "Light snowstorm", max: 35, cont: 25, bow: 1, notIn: [], amt: "1d8", dur: "2d6", unit: "hours", move: "F: x¾; H: normal; C: normal", vis: "x¾", ivis: "x¾", track: "-10%", lost: "+10%", wind: "4d6", note: 3 },
  { key: "sleet", hi: 25, name: "Sleet storm", max: 35, cont: 20, bow: 0, notIn: [], amt: "½d4", dur: "1d6", unit: "hours", move: "F: x¾; H: x½; C: x½", vis: "x¾", ivis: "x¾", track: "-10%", lost: "+5%", wind: "3d10" },
  { key: "hail", hi: 27, name: "Hailstorm", max: 65, cont: 10, bow: 0, notIn: ["desert", "dust"], amt: null, dur: "1d4", unit: "hours", move: "x¾ (all)", vis: "Normal", ivis: "Normal", track: "-10%", lost: "+10%", wind: "4d10", note: 4 },
  { key: "fogH", hi: 30, name: "Heavy fog", min: 20, max: 60, cont: 25, bow: 1, notIn: ["desert", "dust"], amt: null, dur: "1d12", unit: "hours", move: "x¼ (all)", vis: "2' radius", ivis: "x½", track: "-60%", lost: "+50%", wind: "1d20", fog: true },
  { key: "fogL", hi: 38, name: "Light fog", min: 30, max: 70, cont: 30, bow: 3, notIn: ["desert"], amt: null, dur: "2d4", unit: "hours", move: "x½ (all)", vis: "x¼", ivis: "x¾", track: "-30%", lost: "+30%", wind: "1d10", fog: true },
  { key: "mist", hi: 40, name: "Mist", min: 30, cont: 15, bow: 10, notIn: [], amt: null, dur: "2d6", unit: "hours", move: "Normal", vis: "Normal", ivis: "Normal", track: "-5%", lost: "Normal", wind: "1d10", fog: true },
  { key: "drizzle", hi: 45, name: "Drizzle", min: 25, cont: 20, bow: 5, notIn: [], amt: "¼d4", dur: "1d10", unit: "hours", move: "Normal", vis: "Normal", ivis: "Normal", track: "-1% per turn (cumulative)", lost: "Normal", wind: "1d20" },
  { key: "rainL", hi: 60, name: "Light rainstorm", min: 25, cont: 45, bow: 15, notIn: [], amt: "½d6", dur: "1d12", unit: "hours", move: "Normal", vis: "Normal", ivis: "Normal", track: "-10% (cumulative)", lost: "Normal", wind: "1d20", note: 5 },
  { key: "rainH", hi: 70, name: "Heavy rainstorm", min: 25, cont: 30, bow: 20, notIn: [], amt: "1d4+3", dur: "1d12", unit: "hours", move: "F: x¾; H: normal; C: x¾", vis: "x¾", ivis: "x¾", track: "-10% per turn (cumulative)", lost: "+10%", wind: "2d12+10", note: 5 },
  { key: "thunder", hi: 84, name: "Thunderstorm", min: 30, cont: 15, bow: 20, notIn: [], amt: "1d8", dur: "1d4", unit: "hours", move: "x½ (all)", vis: "x¾", ivis: "x¾", track: "-10% per turn", lost: "+10% (+30% if mounted)", wind: "4d10", note: 6 },
  { key: "tropical", hi: 89, name: "Tropical storm", min: 40, cont: 20, bow: 10, notIn: ["desert", "plains"], amt: "1d6", perDay: true, dur: "½d6", unit: "days", move: "F: x¼; H: x¼; C: no", vis: "x½", ivis: "x½", track: "No", lost: "+30%", wind: "3d12+30", note: 7 },
  { key: "monsoon", hi: 94, name: "Monsoon", min: 55, cont: 30, bow: 5, notIn: ["desert", "dust", "plains"], amt: "1d8", perDay: true, dur: "1d6+6", unit: "days", move: "F: x¼; H: x¼; C: no", vis: "x¼", ivis: "x¼", track: "No", lost: "+30%", wind: "6d10", note: 7 },
  { key: "gale", hi: 97, name: "Gale", min: 40, cont: 15, bow: 10, notIn: ["desert"], amt: "1d8", perDay: true, dur: "½d6", unit: "days", move: "F: x¼; H: x¼; C: no", vis: "x¼", ivis: "x¼", track: "No", lost: "+20%", wind: "6d8+40", note: 7 },
  { key: "hurricane", hi: 99, name: "Hurricane or typhoon", min: 55, cont: 20, bow: 5, notIn: ["desert", "dust"], amt: "1d10", perDay: true, dur: "½d8", unit: "days", move: "F: x¼; H: x¼; C: no", vis: "x¼", ivis: "x¼", track: "No", lost: "+30%", wind: "7d10+70", note: 8 }
];

/* Standard Weather Table notes, in plain words. */
export const PRECIP_NOTES = {
  1: "Snow drifts up to 10 feet deep per hour against buildings, walls and the like.",
  2: "Snow drifts up to 5 feet deep per hour against buildings, walls and the like.",
  3: "Snow drifts 1 foot per hour when the wind is over 20 mph.",
  4: "Hailstones average ½d4 inches across. Stones over 1 inch deal 1 point per ½ inch of diameter each turn to anyone of AC 6 or worse; rings, bracers and the like do not help, magic armor does.",
  5: "If the temperature drops to 30 or lower afterward, the ground may ice over.",
  6: "Lightning strikes every 10 minutes: 1% chance of hitting the party (10% if sheltering under trees), 6d6 damage, save for half.",
  7: "Above 40 mph, a 10% chance every 3 turns of gust damage: 1d6 for every full 10 mph above 40.",
  8: "Unsheltered creatures take 1d6 wind damage every 3 turns; buildings take 1d4 structural damage each turn."
};

/* Special Weather Phenomena Table. dur/wind: dice where the printed figure is plain dice notation; durText: as printed. */
export const SPECIAL = {
  "Sand storm": { amt: "—", dur: "1d8", unit: "hours", move: "No", vis: "No", ivis: "No", track: "No", lost: "+80%", wind: "5d10", note: 1 },
  "Dust storm": { amt: "—", dur: "1d8", unit: "hours", move: "No", vis: "No", ivis: "No", track: "No", lost: "+80%", wind: "5d10", note: 1 },
  "Wind storm": { amt: "—", dur: "1d10", unit: "hours", move: "x½ (all)", vis: "x½", ivis: "x¾", track: "No", lost: "+30%", wind: "8d10+20", note: 2 },
  "Earthquake": { amt: "—", dur: "1d10", unit: "hours", move: "F: x¼; H: x¼; C: no (may be overturned)", vis: "Normal", ivis: "Normal", track: "-50%", lost: "+10% (+30% on horse)", wind: "1d20", note: 3 },
  "Undersea earthquake": { amt: "—", dur: "1d10", unit: "hours", move: "F: x¼; H: x¼; C: no (may be overturned)", vis: "Normal", ivis: "Normal", track: "-50%", lost: "+10% (+30% on horse)", wind: "1d20", note: 3, extra: "Undersea: a tsunami follows in 1d10 hours." },
  "Rock avalanche": { amt: "5d10 inches", dur: "1d10", unit: "minutes", move: "May be blocked", vis: "Normal", ivis: "Normal", track: "-60%", lost: "+10% if the trail is covered", wind: "1d20", note: 4 },
  "Snow avalanche": { amt: "5d10 inches", dur: "1d10", unit: "minutes", move: "May be blocked", vis: "Normal", ivis: "Normal", track: "-60%", lost: "+10% if the trail is covered", wind: "1d20", note: 4 },
  "Volcano": { amt: "1d8 inches of ash per day", dur: "½d20", unit: "days", move: "x½ (all)", vis: "x¾", ivis: "x½", track: "-50%", lost: "+20% (+40% if on horse)", wind: "1d20", note: 5 },
  "Undersea volcano": { amt: "1d8 inches of ash per day", dur: "½d20", unit: "days", move: "x½ (all)", vis: "x½ (mist)", ivis: "x½", track: "-50%", lost: "+20% (+40% if on horse)", wind: "1d20", note: 5, extra: "Undersea: an island forms after 2d6 days." },
  "Tsunami": { amt: "Wave height 10d20 feet", dur: "½d4", unit: "hours", move: "Normal", vis: "Normal", ivis: "Normal", track: "No", lost: "Normal", wind: "5d10+10", note: 6 },
  "Quicksand": { amt: "—", durText: "Covers a radius of 1d20\"", move: "Normal (until entered)", vis: "Normal", ivis: "Normal", track: "No", lost: "+20% if skirted", wind: "1d20", note: 7 },
  "Flash flood": { amt: "See note", dur: "1d6+2", unit: "hours", move: "x¾", vis: "Normal", ivis: "Normal", track: "-5% per turn", lost: "+10%", wind: "1d20", note: 8 },
  "Rain forest downpour": { amt: "1 inch per hour", dur: "3d4", unit: "hours", move: "F: x½; H: x½; C: no", vis: "x¾", ivis: "x¾", track: "-5% per turn", lost: "+20%", wind: "1d6-1", note: 9 },
  "Sun shower": { amt: "½ inch", durText: "6-60 minutes", move: "Normal", vis: "Normal", ivis: "Normal", track: "Normal", lost: "Normal", wind: "1d20", note: 10 },
  "Tornado": { amt: "1 inch per hour", durText: "5-50 hours", move: "Nor (as printed)", vis: "x¾", ivis: "x¾", track: "No", lost: "+40%", wind: "300", note: 11 },
  "Oasis": { amt: "—", durText: "3-6\" radius", move: "Normal", vis: "Normal", ivis: "Normal", track: "Normal", lost: "Normal", wind: "1d20", note: 12 },
  "Mirage oasis": { amt: "—", durText: "3-6\" radius", move: "Normal", vis: "Normal", ivis: "Normal", track: "Normal", lost: "Normal", wind: "1d20", note: 12 }
};

export const SPECIAL_NOTES = {
  1: "Until shelter is found, a 50% chance every 3 turns of d4 damage, no save.",
  2: "A 50% chance every 3 turns of 2d6 damage from flying rock; a character rolling dexterity or less on d20 takes half (monsters save vs. petrification).",
  3: "Center 1-100 miles away, felt 1-1000 miles out. 1-4 harmless tremors panic untrained animals; the first shock comes 1-6 rounds later. 1-6 shocks, d20 rounds apart, each as the cleric spell earthquake.",
  4: "2d20 damage, save (dexterity or petrification) for half. Over 20 points means buried; suffocation in 6 rounds unless dug out.",
  5: "Ash burns for d4 every 3 turns, no save. The volcano is d8-1 miles away; lava flows at d10 mph and burns like a salamander's tail. Each day of eruption raises the base temperature 1 degree over 60 miles; this fades after 7-12 months, then clear skies are half as likely there for 1-6 months.",
  6: "Save (dexterity or petrification) or drown; on a success take d20 damage.",
  7: "In no armor, leather, studded leather, elven chain or magic armor, a still victim with arms raised and heavy gear dropped sinks only to the neck. Others sink 1 foot per round (2 if struggling) and drown 3 rounds after going under; d6 per round submerged once revived.",
  8: "Starts as a heavy rainstorm with 3 inches of rain per hour; the rain stops halfway through. Then low ground floods to three times the rain's depth for 6-10 turns, draining 3 inches per hour, with a 5-50 mph current.",
  9: "The ground absorbs the first 6 inches; after that it counts as swamp for travel.",
  10: "95% chance of a rainbow.",
  11: "10% chance of being carried to the Ethereal Plane; otherwise damage as a triple-strength hurricane.",
  12: "If real, roll d20: 1-2 someone is camped there (DMG wilderness encounters); 20 the wells are poisoned. A mirage: anyone who drinks saves vs. spell or takes d6 from swallowing sand."
};

export const RECORD = [[1, "Extreme record low", -3], [2, "Severe record low", -2], [4, "Record low", -1], [96, "Normal temperatures", 0], [98, "Record high", 1], [99, "Severe record high", 2], [100, "Extreme record high", 3]];
export const RECORD_DAYS = [[1, 1], [3, 2], [10, 3], [14, 4], [17, 5], [19, 6], [20, 7]];
export const CAUSE = [[30, "Elemental(s) or giant(s)"], [60, "Elemental(s) under NPC control"], [90, "An NPC or monster"], [98, "Demons, devils, or creatures from the appropriate Elemental Plane"], [99, "A deity or the deity's servants"], [100, "Two or more battling deities"]];
export const DIRECTIONS = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"];

export const CHILL_TEMPS = [35, 30, 25, 20, 15, 10, 5, 0, -5, -10, -15, -20];
export const CHILL = {
  5: [33, 27, 21, 16, 12, 7, 1, -6, -11, -15, -22, -28],
  10: [21, 16, 9, 2, -2, -9, -15, -22, -27, -31, -37, -43],
  15: [16, 11, 1, -6, -11, -18, -25, -33, -40, -45, -51, -58],
  20: [12, 3, -4, -9, -17, -24, -32, -40, -46, -52, -58, -64],
  25: [7, 0, -7, -15, -22, -29, -37, -45, -52, -58, -65, -72],
  30: [5, -2, -11, -18, -26, -33, -41, -49, -56, -63, -70, -78],
  35: [3, -4, -13, -20, -27, -35, -43, -52, -60, -67, -75, -82],
  40: [1, -4, -15, -22, -29, -36, -45, -54, -62, -69, -76, -83],
  45: [1, -6, -17, -24, -31, -38, -46, -55, -63, -70, -77, -84],
  50: [0, -7, -17, -24, -31, -38, -47, -56, -64, -71, -78, -85],
  55: [-1, -8, -19, -25, -33, -39, -48, -57, -65, -72, -79, -86],
  60: [-3, -10, -21, -27, -34, -40, -49, -58, -66, -73, -80, -87]
};

export const HIGH_WIND = [
  [30, "All travel slowed by 25%; torches blown out.", "Sailing difficult; rowing impossible.", "Creatures eagle-sized and smaller can't fly.", "Missiles at ½ range and -1 to hit."],
  [45, "All travel slowed by 50%; torches and small fires blown out.", "Minor ship damage (d4 structural) may occur; waves 3d6 ft.", "Man-sized creatures can't fly.", "Missiles at ¼ range and -3 to hit."],
  [60, "Small trees uprooted; all travel slowed by 75%; roofs may be torn off.", "Ships endangered (d10 structural) and blown off course; waves d10+20 ft.", "Nothing can fly except creatures from the Elemental Plane of Air.", "No missile fire; non-magical weapon attacks -1 to hit; dexterity bonuses to AC lost."],
  [75, "Only strong stone buildings escape damage; travel is impossible.", "Ships capsize and sink; waves d20+20 ft. or more.", "Nothing can fly except creatures from the Elemental Plane of Air.", "No missile fire; non-magical weapon attacks -3 to hit; 20% chance per attack that the weapon is torn away; dexterity bonuses to AC lost."]
];

export const HEAT = [
  [140, "Normal", "0", "0", "-1", "Normal", "2 turns", "5%"],
  [161, "x¾", "0", "-1", "-1", "x¾", "3 turns", "10%"],
  [181, "x½", "-1", "-2", "-2", "x½", "4 turns", "15%"],
  [201, "x¼", "-2", "-3", "-3", "x¼", "5 turns", "20%"]
];
