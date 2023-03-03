import {CURRENT_MIGRATION_VERSION, MODULE, SETTING_MIGRATION_VERSION, TYPES} from "./constants.mjs";
import {KeyGetter, _createBabonus} from "./helpers/helpers.mjs";

/**
 * ** Migration 1: **
 * - move 'itemTypes' into 'filters'.
 * - move 'throwTypes' into 'filters'.
 * - move 'itemRequirements' into 'filters'.
 * - convert 'arbitraryComparison' to an array of objects.
 * - convert 'identifier' to 'id' and create entirely new ids.
 * - convert 'label' to 'name'.
 * - restructure flag object as 'bonuses.<id>' rather than 'bonuses.<target>.<identifier>'.
 * - convert 'values' to 'bonuses'.
 * - move 'target' into flag and rename it 'type'.
 */

/**
 * TARGETS OF MIGRATION:
 * - world items
 * - world items' effects
 *
 * - compendium items
 * - compendium items' effects
 *
 * - world actors
 * - world actors' effects
 * - world actor's items
 * - world actor's items' effects
 *
 * - scenes' templates
 * - scenes' token actors
 * - scenes' token actors' effects
 * - scenes' token actors' items
 * - scenes' token actors' items' effects
 *
 * - compendium actors
 * - compendium actors' effects
 * - compendium actors' items
 * - compendium actors' items' effects
 */

export const migration = {
  migrateWorld: _forceMigrateWorld,
  migrateWorldItems: _migrateWorldItems,
  migrateWorldActors: _migrateWorldActors,
  migrateCompendium: _migrateSingleCompendium,
  migrateDocument: _migrateDocumentDirect
}

// return true or false if world needs migration.
function _worldNeedsMigration() {
  const lastMigration = game.settings.get(MODULE, SETTING_MIGRATION_VERSION);
  return lastMigration < CURRENT_MIGRATION_VERSION;
}

// update migration version such that it doesn't trigger each time the world is loaded.
export async function _updateMigrationVersion() {
  const ver = CURRENT_MIGRATION_VERSION;
  return game.settings.set(MODULE, SETTING_MIGRATION_VERSION, ver);
}

async function _forceMigrateWorld() {
  return _migrateWorld(true);
}

// migrate the entire world and its unlocked compendiums.
export async function _migrateWorld(force = false) {
  if (!game.user.isGM) return;
  const migrate = _worldNeedsMigration();
  if (!migrate && !force) return;
  ui.notifications.info("BABONUS.MigrationBegun", {localize: true, permanent: true});
  await _migrateWorldItems();
  await _migrateWorldActors();
  await _migrateCompendiumItems();
  await _migrateCompendiumActors();
  await _migrateScenes();
  await _updateMigrationVersion();
  ui.notifications.info("BABONUS.MigrationCompleted", {localize: true, permanent: true});
}

async function _migrateWorldItems() {
  if (!game.user.isGM) return;
  console.log("Build-a-Bonus | ---------------------");
  console.log("Build-a-Bonus | MIGRATING WORLD ITEMS");
  console.log("Build-a-Bonus | ---------------------");
  for (const object of game.items) {
    await _migrateDocumentDirect(object);
  }
  return true;
}

async function _migrateWorldActors() {
  if (!game.user.isGM) return;
  console.log("Build-a-Bonus | ----------------------");
  console.log("Build-a-Bonus | MIGRATING WORLD ACTORS");
  console.log("Build-a-Bonus | ----------------------");
  for (const object of game.actors) {
    await _migrateDocumentDirect(object);
  }
  return true;
}

async function _migrateCompendiumItems() {
  if (!game.user.isGM) return;
  console.log("Build-a-Bonus | --------------------------");
  console.log("Build-a-Bonus | MIGRATING COMPENDIUM ITEMS");
  console.log("Build-a-Bonus | (Locked compendiums will be safely ignored)");
  console.log("Build-a-Bonus | --------------------------");
  return _migrateCompendiums("Item");
}

async function _migrateCompendiumActors() {
  if (!game.user.isGM) return;
  console.log("Build-a-Bonus | ---------------------------");
  console.log("Build-a-Bonus | MIGRATING COMPENDIUM ACTORS");
  console.log("Build-a-Bonus | (Locked compendiums will be safely ignored)");
  console.log("Build-a-Bonus | ---------------------------");
  return _migrateCompendiums("Actor");
}

async function _migrateScenes() {
  if (!game.user.isGM) return;
  console.log("Build-a-Bonus | ----------------------");
  console.log("Build-a-Bonus | MIGRATING WORLD SCENES");
  console.log("Build-a-Bonus | ----------------------");
  for (const object of game.scenes) {
    // update templates and unlinked tokens only.
    for (const template of object.templates) {
      await _migrateDocumentDirect(template);
    }
    for (const token of object.tokens) {
      if (token.actorLink) continue;
      if (!token.actor) continue;
      await _migrateDocumentDirect(token.actor);
    }
  }
  return true;
}

// migrate an actor or item compendium.
async function _migrateCompendiums(docType) {
  const packs = game.packs.filter(p => p.documentName === docType && !p.locked);
  for (const pack of packs) await _migrateSingleCompendium(pack)
  return true;
}

async function _migrateSingleCompendium(pack) {
  if (!game.user.isGM) return;
  if (pack.locked) {
    ui.notifications.warn("BABONUS.MigrationLockedPack", {localize: true});
    return false;
  }
  const index = await pack.getIndex({fields: ["flags.babonus.bonuses"]});
  const ids = index.map(i => i._id);
  for (const id of ids) {
    const object = await pack.getDocument(id);
    await _migrateDocumentDirect(object);
  }
  return true;
}

/**
 * Migrate baboni that are NOT on double-embedded effects.
 */
async function _migrateDocumentDirect(object) {
  if (!game.user.isGM) return;
  // should any effects on this document be updated?
  const updateEffectsNormally = (object instanceof Actor) || (object instanceof Item && !object.parent);
  if (updateEffectsNormally) {for (const effect of object.effects) await _migrateDocumentDirect(effect);}
  else if (object instanceof Item && object.parent instanceof Actor) await _migrateDoubleEmbeddedEffects(object);
  if (object instanceof Actor) {for (const item of object.items) await _migrateDocumentDirect(item);}

  const flags = object.getFlag(MODULE, "bonuses");
  if (!flags) return true;
  const entries = Object.entries(flags).filter(([id]) => TYPES.map(t => t.value).includes(id));
  if (entries.length) console.log(`Build-a-Bonus | ... Migrating ${object.documentName}: ${object.name ?? object.label} (${object.uuid})`);
  for (const [type, boni] of entries) {
    for (const bonus in boni) {
      const data = _modifyData(boni[bonus], type);
      try {
        const bab = _createBabonus(data, data.id, {strict: true});
        const set = await object.setFlag("babonus", "bonuses." + data.id, bab.toObject());
        if (set) await object.unsetFlag("babonus", `bonuses.${type}.${bonus}`);
      } catch (err) {
        console.warn(`Build-a-Bonus | THE BABONUS ${data.name} COULD NOT BE MIGRATED DUE TO BAD DATA.`);
        console.warn(err);
      }
    }
    const isE = foundry.utils.isEmpty(object.flags.babonus?.bonuses?.[type]);
    if (isE) await object.update({[`flags.babonus.bonuses.-=${type}`]: null});
  }
  return true;
}

/**
 * Takes an old babonus and returns the new format.
 * babonus: an object
 */
function _modifyData(babonus, type) {
  const data = foundry.utils.duplicate(babonus);

  if (data["itemTypes"]) data.filters.itemTypes = foundry.utils.duplicate(data.itemTypes);
  if (data["throwTypes"]) {
    data.filters.throwTypes = foundry.utils.duplicate(data.throwTypes.filter(i => {
      return KeyGetter.throwTypes.map(t => t.value).includes(i);
    }));
  }
  if (data.filters["weaponProperties"]) {
    if (data.filters.weaponProperties.needed) {
      data.filters.weaponProperties.needed = foundry.utils.duplicate(data.filters.weaponProperties.needed.filter(i => {
        return KeyGetter.weaponProperties.map(t => t.value).includes(i);
      }));
    }
    if (data.filters.weaponProperties.unfit) {
      data.filters.weaponProperties.unfit = foundry.utils.duplicate(data.filters.weaponProperties.unfit.filter(i => {
        return KeyGetter.weaponProperties.map(t => t.value).includes(i);
      }));
    }
  }
  if (data.filters["spellComponents"]) {
    if (data.filters.spellComponents.types) {
      data.filters.spellComponents.types = foundry.utils.duplicate(data.filters.spellComponents.types.filter(i => {
        return KeyGetter.spellComponents.map(t => t.value).includes(i);
      }))
    }
  }
  if (data["itemRequirements"]) data.filters.itemRequirements = foundry.utils.duplicate(data.itemRequirements);

  const unstricts = ["abilities", "baseWeapons", "damageTypes", "saveAbilities", "spellSchools"];
  for (const type of unstricts) {
    if (data.filters[type]) {
      data.filters[type] = foundry.utils.duplicate(data.filters[type].filter(i => {
        return KeyGetter[type].map(t => t.value).includes(i);
      }));
    }
  }

  data.name = data.label;
  data.type = type;
  data.id = foundry.utils.randomID();
  data.bonuses = foundry.utils.duplicate(data.values);

  if (data.filters["arbitraryComparison"]) data.filters.arbitraryComparison = [foundry.utils.duplicate(data.filters.arbitraryComparison)];
  if (data.filters["spellLevels"]) data.filters.spellLevels = data.filters.spellLevels.map(n => n.toString());

  // fix possibly broken auras lacking both aura.range and aura.isTemplate.
  if (data.aura?.enabled) {
    if (data.aura?.isTemplate) {
      delete data.aura.range;
      delete data.aura.blockers;
    } else if (data.aura.range < 1 && data.aura.range !== -1) {
      data.aura.range = 10;
    }
  }

  delete data.itemTypes;
  delete data.throwTypes;
  delete data.itemRequirements;
  delete data.label;
  delete data.values;

  return data;
}

/**
 * Migrate actor.items.effects.
 * object: an item.
 */
async function _migrateDoubleEmbeddedEffects(object) {
  const effects = foundry.utils.duplicate(object.effects);
  if (!effects?.length) return true;

  const newEffects = [];
  for (const effect of effects) {
    const flags = foundry.utils.getProperty(effect, `flags.${MODULE}.bonuses`);
    if (!flags) {
      newEffects.push(effect);
      continue;
    }
    const entries = Object.entries(flags).filter(([id]) => TYPES.map(t => t.value).includes(id));
    for (const [type, boni] of entries) { // attack.{ids}
      for (const bonus in boni) { // id in ids
        const data = _modifyData(boni[bonus], type);
        try {
          const bab = _createBabonus(data, data.id, {strict: true});
          foundry.utils.setProperty(effect, `flags.${MODULE}.bonuses.${data.id}`, bab.toObject());
          foundry.utils.setProperty(effect, `flags.${MODULE}.bonuses.${type}.-=${bonus}`, null);
          delete effect.flags.babonus?.bonuses?.[type]?.[bonus];
          const prop = effect.flags?.babonus?.bonuses?.[type] ?? {};
          if (Object.values(prop).filter(i => !!i).length < 1) {
            foundry.utils.setProperty(effect, `flags.${MODULE}.bonuses.-=${type}`, null);
          }
        } catch (err) {
          console.warn(`Build-a-Bonus | THE BABONUS ${data.name} COULD NOT BE MIGRATED DUE TO BAD DATA.`);
          console.warn(err);
        }
      }
    }
    newEffects.push(effect);
  }
  return object.update({effects: newEffects});
}
