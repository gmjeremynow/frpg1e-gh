/**
 * The deities of Greyhawk Adventures (GA p.4-19) and the clerics who serve them.
 * aex: extra experience cost as a fraction (0.05 = +5%); aexFrom: the level from which it applies (Boccob: after 10th).
 * specials: [level, text] granted powers (cumulative unless the text says otherwise).
 */
export const DEITIES = {
  boccob: {
    name: "Boccob", status: "Greater Deity", page: 5,
    al: "Neutral", wal: "Any", soc: "Magic, Arcane Knowledge", sy: "Eye in a star", cr: "Purple", pn: "Concordant Opposition",
    cleric: { al: "Neutral", alKeys: ["n"], ra: "Purple robe with gold trim", aexText: "special (+5% from 11th level)", aex: 0.05, aexFrom: 11,
      wpn: "flail, mace, staff*, dagger, knife, sling",
      sph: "Astral, Charm, Combat, Divination, Elemental, Summoning, Healing (minor), Guardian (minor)",
      add: ["disc of Concordant Opposition", "dispel magic"] },
    specials: [
      [8, "Limited sage ability (DMG): major field Supernatural and Unusual, one special category per 4 points of intelligence; needs access to a library to answer questions or research."],
      [10, "May use magic-user items: all wands (not rods or staves, except those usable by clerics), crystal balls, robes (not a robe of the archmagi). From now on pays 5% more experience for each new level (GA p.6)."]
    ],
    stronghold: true,
    specialNote: "With a religious stronghold (PHB), a priest of Boccob may enchant Boccob's eye-in-a-star symbols as scrying devices: each costs 5,000 g.p. and takes 13 weeks, one per 3½ points of intelligence. The devices function only within the stronghold, each acting as a crystal ball that can scry only the area in which it is placed; the cleric may use them from any location on the Prime Material Plane (both as printed). Success is 100%, with three hours of scrying a day in all (GA p.5-6)."
  },
  celestian: {
    name: "Celestian", status: "Lesser Deity", page: 6,
    al: "Neutral good", wal: "Any good", soc: "Stars, Space, Wanderers", sy: "Black circle with seven stars", cr: "Black", pn: "Astral",
    cleric: { al: "Any good", alKeys: ["lg", "ng", "cg"], ra: "Black robe covered with stars", aexText: "+10%", aex: 0.10,
      wpn: "spear*, short sword, staff",
      sph: "Astral, Creation, Sun, Necromantic (minor), Healing, Guardian (minor)",
      add: ["meteors", "create water", "endure cold/heat", "resist cold", "resist fire", "flame walk", "create food and water", "quest", "chariot of Sustarre", "wind walk"] },
    specials: [
      [1, "Feather fall once a day."], [3, "Jump once a day."], [5, "Levitate once a day."], [7, "Spider climb once a day."],
      [9, "Fly once a day."], [11, "Dimension door once a day."], [16, "Teleport once a day."]
    ],
    specialNote: "Each special spell is usable once a day at the cleric's level, with normal casting times; they are cumulative, so a 16th level cleric has seven a day. All Celestian priests have a working knowledge of astronomy and navigation (GA p.8)."
  },
  stCuthbert: {
    name: "St. Cuthbert", status: "Lesser Deity", page: 9,
    al: "Lawful good (Lawful neutral)", wal: "Lawful good, Lawful neutral", soc: "Wisdom, Dedication, Zeal", sy: "Wooden billet, starburst, crumpled hat", cr: "Brown, green", pn: "Arcadia",
    cleric: { al: "Lawful good or Lawful neutral", alKeys: ["lg", "ln"], ra: "By order (see below)", aexText: "none", aex: 0,
      wpn: "club*, flail, mace*, staff*, sling",
      sph: "Charm, Combat (minor), Divination, Protection (minor), Healing, Necromantic",
      add: ["beguiling", "speak with dead", "create food and water", "speak with plants", "heroes' feast", "stone tell", "succor", "dispel evil", "symbol", "holy word"] },
    orders: {
      chapeaux: { label: "Chapeaux", ra: "Varying garb; crumpled brown and green tartan hat with the copper starburst", special: [3, "Shillelagh once a day at the cleric's level."], note: "Seek to convert people to the faith." },
      stars: { label: "Stars", ra: "Dark green robes; starburst in copper, gold or platinum by status", special: [4, "ESP once a day at the cleric's level."], note: "Keep doctrine pure; most (70%) are lawful neutral." },
      billets: { label: "Billets", ra: "Simple brown and russet garments; cudgel symbol of oak or bronzewood", special: [2, "Friends once a day at the cleric's level."], note: "The most numerous order; minister to and protect the faithful; most (70%) are lawful good." }
    },
    specials: [],
    specialNote: "Great rivalry with the followers of Pholtus (GA p.9)."
  },
  ehlonna: {
    name: "Ehlonna", status: "Lesser Deity", page: 10,
    al: "Neutral good", wal: "Any good, neutral", soc: "Forests, Flowers, Meadows", sy: "Unicorn horn", cr: "Pale green", pn: "Prime Material",
    cleric: { al: "Neutral good or neutral", alKeys: ["ng", "n"], ra: "Pale green robe", aexText: "+5%", aex: 0.05,
      wpn: "long bow*, knife, spear, staff, lasso, club",
      sph: "Animal, Combat, Elemental (minor), Creation (minor), Weather, Sun, Plant, Healing",
      add: ["stalk"] },
    specials: [
      [1, "Tracks as a ranger of the cleric's level. Chooses one plant species as a special ward."],
      [5, "Animal friendship once a day at the cleric's level, not counted against the spell maximum."]
    ]
  },
  fharlanghn: {
    name: "Fharlanghn", status: "Lesser Deity", page: 11,
    al: "Neutral good", wal: "Any (Neutral preferred)", soc: "Horizons, Distance, Travel", sy: "Wooden disc with a curved line, representing the horizon, across the upper half", cr: "Brown, green", pn: "Prime Material",
    cleric: { al: "Neutral", alKeys: ["n"], ra: "Urban priests brown robes; pastoral priests green robes", aexText: "none", aex: 0,
      wpn: "Standard",
      sph: "Astral, Elemental, Healing, Weather, Summoning (minor), Combat (minor)",
      add: ["footsore", "endure cold/heat", "locate animal", "resist cold", "locate plant", "resist fire", "create food and water", "locate object", "plant door", "tongues", "quest", "pass plant", "transport via plants", "find the path"] },
    specials: [],
    lost: true,
    specialNote: "Chance to avoid getting lost outdoors (DMG): 35% at 1st level, +1% per level gained (GA p.11)."
  },
  incabulos: {
    name: "Incabulos", status: "Major Deity", page: 12,
    al: "Neutral evil", wal: "Any evil", soc: "Evil, Plagues, Nightmares", sy: "Eye of possession", cr: "Black, orange", pn: "Hades",
    cleric: { al: "Any evil", alKeys: ["le", "ne", "ce"], ra: "Black during services; masters of disguise", aexText: "+5%", aex: 0.05,
      wpn: "club, flail, mace, staff*, lasso, sling",
      sph: "Astral, Combat, Divination (minor), Healing, Necromantic, Summoning, Sun (reversed)",
      add: ["plague", "dispel magic", "bestow curse", "spike growth", "giant insect", "spike stones", "quest", "transmute water to dust", "wall of thorns", "weather summoning", "creeping doom", "insect plague", "earthquake"] },
    specials: [
      [5, "Hypnotism once a day, cast at 3rd level ability at 5th, one level higher for each level gained."],
      [8, "Permanent sleep once a day: casting time 1 segment, one touched creature (save vs. spells at −3 negates)."]
    ],
    disease: true,
    specialNote: "Immunity to all diseases and slimes (cause disease, plague, mummy rot, green slime, violet fungi and the like): 20% at 1st level, +2% per level gained (GA p.12)."
  },
  istus: {
    name: "Istus", status: "Major Deity", page: 13,
    al: "Neutral", wal: "Any (neutral preferred)", soc: "Fate, Destiny", sy: "Golden spindle with three strands", cr: "Gray, black", pn: "Unrevealed",
    cleric: { al: "Neutral", alKeys: ["n"], ra: "Gray or black robes; web patterns for high-level vestments; golden spindle worn openly; hair at least six inches long", aexText: "5%", aex: 0.05,
      wpn: "club, flail*, hammer, mace, staff, lasso",
      sph: "Astral, Charm (minor), Divination, Healing, Necromantic, Protection (minor)",
      add: ["enmeshment", "bless", "predict weather", "chant", "prayer", "quest", "stone tell", "reincarnate"] },
    specials: [
      [3, "Augury once a day, not counted against the spell total."],
      [7, "Strand of binding once a day: range 10 feet, lasts 1 round per level; a victim who fails the save may make one bend bars/lift gates roll to break it."]
    ],
    specialNote: "Most clerics of Istus are female (80%) (GA p.14)."
  },
  iuz: {
    name: "Iuz", status: "Demigod", page: 14,
    al: "Chaotic evil", wal: "Any evil", soc: "Oppression, Deceit, Pain", sy: "Grinning human skull", cr: "Rusty black", pn: "Prime Material",
    cleric: { al: "Chaotic evil", alKeys: ["ce"], ra: "Black, or bloodstained white", aexText: "none", aex: 0,
      wpn: "club, flail, mace*, staff, sling, garrote",
      sph: "Combat, Guardian, Divination (minor), Healing, Necromantic (minor), Summoning, Sun (reversed)",
      add: ["spittle", "cause fear", "heat metal", "dispel magic", "true seeing", "feeblemind", "forbiddance", "confusion"] },
    specials: [[3, "Change self once a day at the cleric's level."]],
    specialNote: "Dedicated trophy hunters; status partly depends on the trophies (especially skulls) taken from defeated foes (GA p.15). Iuz is a demigod and uses no avatar (GA p.4)."
  },
  nerull: {
    name: "Nerull", status: "Major Deity", page: 15,
    al: "Neutral evil", wal: "Any evil", soc: "Death, Darkness, Underworld", sy: "Skull and scythe", cr: "Rust-red", pn: "Tarterus",
    cleric: { al: "Any evil", alKeys: ["le", "ne", "ce"], ra: "Rust-red or black garments", aexText: "5%", aex: 0.05,
      wpn: "staff*, plus specials",
      sph: "Astral, Combat, Divination (minor), Healing, Guardian, Necromantic, Sun (reversed)",
      add: ["ebony tendrils", "command", "pass without trace", "sanctuary", "hold person", "obscurement", "withdraw", "dispel magic", "meld into stone", "quest", "part water", "aerial servant", "word of recall", "succor"] },
    specials: [
      [1, "Surprised only on a 1. Trained in small sickles (equal to daggers), in addition to the normal weapons."],
      [5, "Trained in scythe-like pole arms (treat as hook-fauchards)."]
    ]
  },
  pholtus: {
    name: "Pholtus", status: "Lesser Deity", page: 16,
    al: "Lawful good (neutral)", wal: "Any lawful", soc: "Light, Resolution, Law", sy: "Silvery sun", cr: "White, silver, and gold", pn: "Arcadia",
    cleric: { al: "Lawful neutral", alKeys: ["ln"], ra: "White (Glimmering), white and silver (Gleam), white and gold (Shining)", aexText: "+5%", aex: 0.05,
      wpn: "Standard",
      sph: "Astral, Charm (minor), Combat, Divination (minor), Protection (minor), Healing, Sun",
      add: ["sunburst", "produce flame", "pyrotechnics", "dispel magic", "rainbow"] },
    specials: [[1, "Glimmering (levels 1-4): dispel darkness once a day."], [5, "Gleam (levels 5-8): glow once a day."], [9, "Shining (9th and up): reflect once a day."]],
    specialNote: "The special spells are cumulative, cast at the cleric's level and not counted against the spell maximum (GA p.17)."
  },
  ralishaz: {
    name: "Ralishaz", status: "Lesser Deity", page: 17,
    al: "Chaotic Neutral (Evil)", wal: "Any, but usually chaotic", soc: "Chance, Ill Luck, Misfortune", sy: "Three bone sticks", cr: "none", pn: "Limbo",
    cleric: { al: "Chaotic neutral", alKeys: ["cn"], ra: "Varicolored robe", aexText: "none", aex: 0,
      wpn: "sling*, mace",
      sph: "Combat, Healing, Guardian (minor), Divination (minor), Creation, Protection",
      add: ["vicissitude", "commune", "reincarnate", "confusion"] },
    specials: [],
    gaze: true,
    specialNote: "At 3rd, 4th, 5th or 6th level (roll 1d4 for each cleric) gains a sleep gaze once a day (as the spell; save vs. spells negates) (GA p.18)."
  },
  ulaa: {
    name: "Ulaa", status: "Major Deity", page: 18,
    al: "Lawful good", wal: "Any good, neutral", soc: "Hills, Mountains, Gems", sy: "Mountain with ruby heart", cr: "Green, brown, gray", pn: "Seven Heavens, Concordant Opposition (the cleric entry also says Elemental Plane of Earth, as printed)",
    cleric: { al: "Lawful good, neutral", alKeys: ["lg", "n"], ra: "Robes of brown, green, or both, by level", aexText: "+5%", aex: 0.05,
      wpn: "club, flail, hammer*, mace, staff, military pick*, sling",
      sph: "Combat, Elemental, Protection, Healing, Guardian, Divination (minor)",
      add: ["command earth", "light", "continual light", "quest", "animate object", "heroes' feast"] },
    specials: [
      [1, "Detect invisible objects (levels 1-3). Demi-humans with infravision have this capability doubled when using it (as printed)."], [4, "Dig (levels 4-6)."], [7, "Passwall (levels 7-9)."], [10, "Stone to flesh (10th and up)."]
    ],
    foe: true,
    specialNote: "Chooses one kind of creature as a foe at 1st level: +1 damage against it in melee, +1 more for every three levels gained, at most +4 (GA p.19). The granted spells are cast at the cleric's level with normal casting times."
  }
};

/** Ulaa's damage bonus against the chosen foe: +1, +1 more per three levels gained, at most +4. */
export const ulaaFoeBonus = level => Math.min(4, 1 + Math.floor((Math.max(1, level) - 1) / 3));
/** Pholtus' rank. */
export const pholtusRank = level => (level >= 9 ? "Shining" : level >= 5 ? "Gleam" : "Glimmering");
