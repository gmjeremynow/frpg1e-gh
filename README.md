# Greyhawk for 1e FRPG

An optional add-on for 1e FRPG (Table Edition), built from the World of Greyhawk boxed set (1983: the Guide and the Glossography) and Greyhawk Adventures (1988). Turn it on or off in *Manage Modules*. It needs the system at 0.32.0 or later. Keep it private: the compendia hold text and maps from the books.

## Install

Put the `frpg1e-gh` folder in `Data/modules` (or install the zip), switch it on in the world, and accept the offer to build the Greyhawk compendia. They can be rebuilt any time from *Configure Settings → Greyhawk → Rebuild Greyhawk compendia*.

## What it adds

- **Deity clerics:** a cleric class for each Greyhawk Adventures deity (Boccob, Celestian, St. Cuthbert, Ehlonna, Fharlanghn, Incabulos, Istus, Iuz, Nerull, Pholtus, Ralishaz, Ulaa). Each one is built on the PHB cleric, with the deity's extra experience cost applied to the level table (Boccob's +5% from 11th level only). The sheet warns when the alignment does not fit.
- **World setting "Deity clerics only"** (off by default) takes the plain PHB cleric out of the class list.
- **Greyhawk tab** on the character sheet:
  - For a deity cleric: the deity, the clerics' alignment, raiment, weapons, spheres and additional spells, and the granted powers by level.
  - Worked-out numbers: Fharlanghn's chance to avoid getting lost, Incabulos' disease immunity, Ulaa's foe bonus, Pholtus' rank and Boccob's scrying devices.
  - St. Cuthbert's order and Ehlonna's plant ward, and a roll for Ralishaz's sleep gaze.
  - For any character: a zero-level tracker (GA Appendix 1) with the aptitude-point roll and the two alignment scores.
- **Compendia:**
  - Greyhawk (books): the Guide, the Glossography and Greyhawk Adventures by chapter, one page per state, deity, personality, place and adventure (the Guide and Glossography deity chapters too, from 0.1.2), plus the Greyhawk Rules Summary (deity clerics, calendar, settlement populations, rates of travel, patrols and high-level NPCs).
  - Greyhawk Spells: the 12 deity cleric spells and the 106 wizards' spells of Greyhawk Adventures, under generic names with the wizard's name dropped (e.g. Feeling Fingers, Private Sanctum, Steaming Sphere), as the system does. Folders are by theme: hand and force, travel and utility, protection and guardian, light and darkness, sphere and screen, sound and music, mind, and warrior spells.
  - Greyhawk Magic Items: the 97 items of Greyhawk Adventures.
  - Greyhawk Monsters and Avatars: the 13 monsters and the 11 avatars.
  - Greyhawk Personalities: the 14 personalities of the Hall of Heroes as NPCs.
  - Greyhawk Tables: 101 encounter tables by region and terrain, the 6 birthplace tables, and 16 weather tables (records, precipitation, continuing precipitation, direction, causes, and special weather for each terrain) (Glossography).
  - Greyhawk Macros: **Greyhawk Weather**, which rolls the full weather procedure of the Glossography (p.18-25) for 1 to 14 days.
  - Greyhawk Maps: the two 1983 poster maps of the Flanaess as scenes.

## Choices and limits

- **Greyhawk Adventures text:** taken from the scan and checked against the PDF's own text layer, which is a second OCR stored in a shifted font encoding. Where the two readings disagree, the page image decides (0.1.3).
- **Guide and Glossography text:** these PDFs have no such layer. Their text comes from the scan, with the numbers cross-checked against the PDF's own OCR; the two readings disagreed on fewer than 2% of numbers, and those were reviewed.
- **Numbers on the sheet and in the compendia:** every statistic, encounter range and birthplace range was checked against the page images.
- **Kept as printed:**
  - Sterich has no encounter for 48-49, and Ogres appears twice in the Geoff table.
  - The Ingundi is printed as Inguni in the table of contents.
  - Nerof Gasgal's THAC0 is printed 8.
  - The Red Turban of Tusmit's value is printed "2,500 x.p.".
  - The Elves column of the demi-human birthplace table is marked * but the footnote cannot be read in this copy.
- **Weather generator (0.1.5):** the Greyhawk Weather macro, or `game.greyhawk.weather()`, asks for the month, latitude, terrain, elevation and sea current, then rolls temperature (with optional record highs and lows), sky, precipitation and its type, duration, continuation, wind, rainbows, wind chill, high winds, heat and humidity, and the direction and possible cause of special weather. The report is whispered to the GM unless you choose to show it to players. Where the book leaves it open, the macro checks a precipitation type's minimum temperature against the day's high and its maximum against the day's low, applies elevation in any terrain (as the book's own example does), and rolls rough terrain's "+/-5 mph" as +5 or -5 at random. Far from the 40th parallel the book's 2 degrees per degree of latitude gives extreme temperatures; the macro applies it as printed.
- **Tables added (0.1.4):** the Glossography weather tables (p.18-25: distance correspondences, major parallels, baseline data by month with moon phases, terrain effects, wind chill, high wind effects, precipitation occurrence, standard weather, special weather phenomena, temperature and humidity, each with its notes), the Patrol Encounters Table (p.7), the Guide's titles and honorifics and the peers of the realm and knights' precedence (p.79), and the Guide's rune chart (p.17), shown as images cropped from the page scan with every hand-lettered meaning transcribed. Where a printed table is misaligned (the second-half sky labels of the baseline chart, the Leaders and Others columns of the patrol table), it is reproduced as printed with a note.
- **Misreadings corrected (0.1.3):** every book page was compared word by word with the PDF's text layer, and disputed readings were checked against the page images. Fixed: run-together words ("anda", "wasa", "Ifthe"), hyphens lost at line ends ("manure-covered", "zero-level"), "ore/ores" read for "orc/orcs", fractions ("½ damage", "HD ½"), garbled quotation marks, junk from illustrations and map margins, paragraphs split mid-sentence, and lost opening words under the decorated capitals. Restored text the scan had dropped or scrambled: the GA deity spell headers (Beguiling, Stalk, Footsore, Enmeshment, Ebony Tendrils, Vicissitude), Celestian's and Ulaa's spell tables, Nerof Gasgal's and Sental Nurev's split paragraphs, stat lines in the GA adventures, and the tables of eleven GA magic items; the Guide's chronology table, racial strains and dress, ruler lines and populations of the states, the Order of the Hart and the social rank chart; the Glossography rulers list, the armed parties of the encounter chapter, the weather chapter prose, the quasi-deity statistics blocks, and details in the deity pages (Hextor's weapons, Olidammara's ring and Kanteel, Ralishaz's enchantment table, Trithereon's summoned creatures, Wastri's glaive-guisarme). Source misprints are kept as printed (for example Keoghland, Gasgol, Lirtlemark, Zuggtoy, Fharlanghan in GA, "seale", "offery").
- **Deities (0.1.2):** the Guide's list of all 60 deities (p.63-64: 15 greater gods, Cyndor as greater/lesser god, 40 lesser gods, 5 demigods, with origin, attributes, alignment and sex) was missing and is now transcribed from the page images, with the full origin and alignment keys. The Guide and Glossography deity chapters now have one page per deity (21 in the Guide, 22 in the Glossography including Zagyg). Each Guide page starts with its heading line (rank, alignment, areas of concern), transcribed from the page images; each Glossography page starts with the full statistics block, taken from the PDF's text layer and checked line by line against the page images (armor class, move, hit points and other lines had been lost). Repaired from the page images: the Guide's opening sentence, Celestian's priesthood table, Pholtus' ranks, the Kanteel's seven powers, Obad-hai's forms, Wastri's summons; in the Glossography the standard divine abilities, the clerics' added experience costs, Celestian's, Pholtus' and Ulaa's clerical spell tables, Fharlanghn's and Ulaa's spell lists, Xan Yae's monk table and disciplines, and Wastri's toads. Kelanen's powers moved to Personages and Quasi-Deities. Kept as printed: Raxivort's origin M (not in the key), Syrul's alignment NE(I), Olidammara's "Rougery", Procan, Bleredd and Olidammara "NC", Hextor's strength bonus on his attacks line, Raxivort's blank attack/defense modes, Xan Yae's psionic ability "1", Fharlanghn's "pass wall". Zagyg has a statistics block only, no text.
- **Spell names (0.1.1):** wizards' names are dropped from spell names, from references to other spells in their descriptions, and from spell references in the book pages (e.g. floating disc, Instant Summons). Two lore asides naming a spell's creator were reworded or removed. The wizards themselves still appear as Greyhawk personalities.
- **Spheres:** shown, not enforced. GA gives them for an optional second edition rule.
- **Personalities:** they keep their printed armor class, THAC0 and damage in their biographies. The sheet works these out from the class, abilities and equipment.
- **Maps:** the scenes are images without a grid; each hex is 10 leagues (30 miles). The 1980 folio is not included.

## Rebuilding the data

The scripts in `build/` read the OCR of the page scans and the GA text layer (not included) and write `data/`. Run `build_all.py`.
