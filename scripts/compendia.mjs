/** World compendia built from the module's JSON (same approach as the system: no compiled LevelDB packs). */
const MID = "frpg1e-gh";
export const DATA_VERSION = "6";

const PACKS = [
  { name: "gh-lore", label: "Greyhawk (books)", file: "journals.json", type: "JournalEntry", folder: d => d.folder },
  { name: "gh-spells", label: "Greyhawk Spells", file: "spells.json", type: "Item", folder: d => d.folder },
  { name: "gh-magic", label: "Greyhawk Magic Items", file: "magic-items.json", type: "Item", folder: d => d.folder },
  { name: "gh-monsters", label: "Greyhawk Monsters and Avatars", file: "monsters.json", type: "Actor", folder: d => d.folder },
  { name: "gh-npcs", label: "Greyhawk Personalities", file: "npcs.json", type: "Actor", folder: d => d.folder },
  { name: "gh-tables", label: "Greyhawk Tables", file: "tables.json", type: "RollTable", folder: d => d.folder },
  { name: "gh-maps", label: "Greyhawk Maps", file: "scenes.json", type: "Scene", folder: d => d.folder },
  { name: "gh-macros", label: "Greyhawk Macros", file: "macros.json", type: "Macro", folder: d => d.folder }
];
const CLS = { Item: () => Item, Actor: () => Actor, JournalEntry: () => JournalEntry, RollTable: () => RollTable, Scene: () => Scene, Macro: () => Macro };

export async function offerImport() {
  if (game.settings.get(MID, "compendiaVersion") === DATA_VERSION) return;
  const ok = await foundry.applications.api.DialogV2.confirm({
    window: { title: "Greyhawk: Compendia" },
    content: "<p>Create the Greyhawk world compendia (the books by chapter, spells, magic items, monsters and avatars, personalities, roll tables, the Flanaess maps and the weather macro)?</p><p class=\"hint\">You can do this later from Game Settings → Configure Settings → Greyhawk.</p>",
    rejectClose: false
  });
  if (ok) await importCompendia();
  else await game.settings.set(MID, "compendiaVersion", DATA_VERSION);
}

export async function importCompendia({ confirm = false } = {}) {
  if (!game.user.isGM) return;
  if (confirm) {
    const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "Rebuild Greyhawk Compendia" },
      content: "<p>Rebuild the Greyhawk compendia? Existing copies in this world are replaced.</p>", rejectClose: false });
    if (!ok) return;
  }
  const CC = foundry.documents.collections.CompendiumCollection;
  for (const def of PACKS) {
    let data;
    try { data = await (await fetch(`modules/${MID}/data/${def.file}`)).json(); } catch { continue; }
    if (!data?.length) continue;
    const existing = game.packs.get(`world.${def.name}`);
    if (existing) await existing.deleteCompendium();
    const pack = await CC.createCompendium({ name: def.name, label: def.label, type: def.type });
    const names = [...new Set(data.map(def.folder).filter(Boolean))];
    const folders = names.length ? await Folder.createDocuments(names.map((name, i) => ({ name, type: def.type, sorting: "m", sort: i * 10 })), { pack: pack.collection }) : [];
    const byName = new Map(folders.map(f => [f.name, f.id]));
    const docs = data.map(d => { const { folder, ...rest } = d; return { ...rest, folder: byName.get(folder) ?? null }; });
    const cls = CLS[def.type]();
    for (let i = 0; i < docs.length; i += 50) await cls.createDocuments(docs.slice(i, i + 50), { pack: pack.collection });
    ui.notifications.info(`${def.label}: ${docs.length} entries.`);
  }
  await game.settings.set(MID, "compendiaVersion", DATA_VERSION);
}
