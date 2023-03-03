import {MODULE} from "./constants.mjs";
import {FILTER} from "./filters.mjs";
import {
  _getMinimumDistanceBetweenTokens,
  _createBabonus,
  _openWorkshop,
  _getAllTokenGridSpaces,
  _getCollection
} from "./helpers/helpers.mjs";
import {migration} from "./migration.mjs";

export function _createAPI() {
  const API = {
    getId, getIds,
    getName, getNames,
    getType,
    getCollection,
    fromUuid,

    deleteBonus, copyBonus,
    toggleBonus, moveBonus,
    createBabonus,

    findEmbeddedDocumentsWithBonuses,
    findTokensInRangeOfAura,
    findTokensInRangeOfToken,
    openBabonusWorkshop,
    getAllContainingTemplates,
    getMinimumDistanceBetweenTokens,
    sceneTokensByDisposition,
    getOccupiedGridSpaces,
    getApplicableBonuses,
    migration: migration
  };
  game.modules.get(MODULE).api = API;
  window.babonus = API;
}

/**
 * Return all bonuses that applies to a specific roll.
 * @param {Document5e} object           The actor (for hitdie and throw) or item (for attack, damage, save).
 * @param {string} type                 The type of rolling (attack, damage, save, throw, hitdie).
 * @param {object} options              Additional context for the inner methods.
 * @param {string} options.throwType    The type of saving throw (key of an ability, 'death' or 'concentration').
 * @param {boolean} options.isConcSave  Whether the saving throw is for maintaining concentration.
 * @returns {array<Babonus>}            An array of valid babonuses.
 */
function getApplicableBonuses(object, type, {throwType = "int", isConcSave = false} = {}) {
  if (type === "hitdie") return FILTER.hitDieCheck(object);
  else if (type === "throw") return FILTER.throwCheck(object, throwType, {throwType, isConcSave});
  else if (["attack", "damage", "save"].includes(type)) return FILTER.itemCheck(object, type);
}

/**
 * Return a babonus that has the given name. If more are found, returns the first found.
 * @param {Document5e} object   The document that has the babonus.
 * @param {string} name         The name of the babonus.
 * @returns {Babonus}           The found babonus.
 */
function getName(object, name) {
  return _getCollection(object).getName(name);
}

/**
 * Return the names of all bonuses on the document.
 * @param {Document5e} object   The document that has the babonuses.
 * @returns {array<string>}     An array of names.
 */
function getNames(object) {
  return Object.values(object.flags.babonus?.bonuses ?? {}).filter(({name}) => name);
}

/**
 * Return a babonus that has the given id.
 * @param {Document5e} object   The document that has the babonus.
 * @param {string} id           The id of the babonus.
 * @returns {Babonus}           The found babonus.
 */
function getId(object, id) {
  return _getCollection(object).get(id);
}

/**
 * Return the ids of all bonuses on the document.
 * @param {Document5e} object   The document that has the babonuses.
 * @returns {array<string>}     An array of ids.
 */
function getIds(object) {
  return Object.keys(object.flags.babonus?.bonuses ?? {}).filter(id => foundry.data.validators.isValidId(id))
}

/**
 * Return an array of the bonuses of a given type on the document.
 * @param {Document5e} object     The document that has the babonuses.
 * @param {array<Babonus>} type    The type of babonuses to find.
 */
function getType(object, type) {
  return _getCollection(object).filter(b => b.type === type);
}

/**
 * Return the ids of all templates on the scene if they contain the token document.
 * @param {TokenDocument5e} tokenDoc    The token document.
 * @returns {array<string>}             An array of ids.
 */
function getAllContainingTemplates(tokenDoc) {
  const size = tokenDoc.parent.grid.size;
  const centers = _getAllTokenGridSpaces(tokenDoc).map(({x, y}) => {
    return {x: x + size / 2, y: y + size / 2};
  });

  return tokenDoc.parent.templates.filter(template => {
    return centers.some(({x, y}) => {
      return template.object.shape.contains(x - template.x, y - template.y);
    });
  }).map(t => t.id);
}

/**
 * Delete a babonus from a document.
 * @param {Document5e} object       A measured template, active effect, actor, or item to delete from.
 * @param {string} id               The id of the babonus to remove.
 * @returns {Promise<Document5e>}   The updated document.
 */
async function deleteBonus(object, id) {
  const bonus = getId(object, id);
  if (!bonus) return null;
  return object.update({[`flags.babonus.bonuses.-=${bonus.id}`]: null});
}

/**
 * Copy a babonus from a document to another.
 * @param {Document5e} original     A measured template, active effect, actor, or item to copy from.
 * @param {Document5e} other        A measured template, active effect, actor, or item to copy to.
 * @param {string} id               The id of the babonus to copy.
 * @returns {Promise<Document5e>}   The original after the update.
 */
async function copyBonus(original, other, id) {
  const data = getId(original, id).toObject();
  data.id = foundry.utils.randomID();
  return other.update({[`flags.babonus.bonuses.${data.id}`]: data});
}

/**
 * Move a babonus from a document to another.
 * @param {Document5e} original     A measured template, active effect, actor, or item to move from.
 * @param {Document5e} other        A measured template, active effect, actor, or item to move to.
 * @param {string} id               The id of the babonus to move.
 * @returns {Promise<Document5e>}   The other document after the update.
 */
async function moveBonus(original, other, id) {
  const copy = await copyBonus(original, other, id);
  if (!copy) return null;
  return deleteBonus(original, id);
}

/**
 * Toggle a babonus on a document
 * @param {Document5e} object       A measured template, active effect, actor, or item.
 * @param {string} id               The id of the babonus to toggle.
 * @param {boolean} state           A specific toggle state to set a babonus to (true or false).
 * @returns {Promise<Document5e>}   The document after the update.
 */
async function toggleBonus(object, id, state = null) {
  const bonus = getId(object, id);
  if (!bonus) return null;
  const value = (state === null) ? !bonus.enabled : !!state;
  return object.update({[`flags.babonus.bonuses.${id}.enabled`]: value});
}

/**
 * Return an object of arrays of items and effects on the given document
 * that have one or more babonuses embedded in them.
 * @param {Document5e} object     An actor or item with embedded documents.
 * @returns {object}              An object with an array of effects and array of items.
 */
function findEmbeddedDocumentsWithBonuses(object) {
  let items = [];
  let effects = [];

  if (object instanceof Actor) {
    items = object.items.filter(item => {
      return _getCollection(item).size > 0;
    });
  }
  if (object instanceof Actor || object instanceof Item) {
    effects = object.effects.filter(effect => {
      return _getCollection(effect).size > 0;
    });
  }
  return {effects, items};
}

/**
 * Return all token documents that are in range of an aura.
 * @param {Document5e} object           The actor, item, or effect with the babonus.
 * @param {string} id                   The id of the babonus.
 * @returns {array<TokenDocument5e>}    An array of token documents.
 */
function findTokensInRangeOfAura(object, id) {
  const bonus = getId(object, id);
  if (!bonus.hasAura) return null;
  let actor;
  if (object instanceof Actor) actor = object;
  else if (object instanceof Item) actor = object.actor;
  else if (object instanceof ActiveEffect) actor = object.parent;
  const tokenDoc = actor.token ?? actor.getActiveTokens(false, true)[0];
  if (bonus.aura.range === -1) return canvas.scene.tokens.filter(t => {
    if (!t.actor) return false;
    if (t.actor.type === "group") return false;
    return t !== tokenDoc;
  });
  return canvas.scene.tokens.filter(t => {
    if (!t.actor) return false;
    if (t.actor.type === "group") return false;
    if (t === tokenDoc) return false;
    const distance = _getMinimumDistanceBetweenTokens(t.object, tokenDoc.object);
    return bonus.aura.range >= distance;
  });
}

/**
 * Return an array of tokens that are within a radius of the source token.
 * Credit to @Freeze#2689 for much artistic aid.
 * @param {Token5e} source      The source token placeable.
 * @param {number} radius       The radius (usually feet) to extend from the source.
 * @returns {array<Token5e>}    An array of token placeables, excluding the source.
 */
function findTokensInRangeOfToken(source, radius) {
  const tokenRadius = Math.abs(source.document.x - source.center.x);
  const pixels = radius / canvas.scene.grid.distance * canvas.scene.grid.size + tokenRadius;
  const captureArea = new PIXI.Circle(source.center.x, source.center.y, pixels);
  const grid = canvas.grid.size;
  return canvas.tokens.placeables.filter(t => {
    if (t === source) return false;

    const {width, height, x, y} = t.document;
    if (width <= 1 && height <= 1) return captureArea.contains(t.center.x, t.center.y);
    for (let a = 0; a < width; a++) {
      for (let b = 0; b < height; b++) {
        const test = captureArea.contains(...canvas.grid.getCenter(x + a * grid, y + b * grid));
        if (test) return true;
      }
    }
    return false;
  });
}

/**
 * Return the minimum distance between two tokens, evaluating height and all grid spaces they occupy.
 * @param {Token5e} tokenA    One token placeable.
 * @param {Token5e} tokenB    Another token placeable.
 * @returns {number}          The minimum distance.
 */
function getMinimumDistanceBetweenTokens(tokenA, tokenB) {
  return _getMinimumDistanceBetweenTokens(tokenA, tokenB);
}

/**
 * Render the build-a-bonus application for a document.
 * @param {Document5e} object   An actor, item, or effect.
 * @returns {BabonusWorkshop}   The rendered workshop.
 */
function openBabonusWorkshop(object) {
  const validDocumentType = (
    (object instanceof Actor)
    || (object instanceof Item)
    || (object instanceof ActiveEffect && !(object.parent.parent instanceof Actor))
  );
  if (!validDocumentType) {
    console.warn("The document provided is not a valid document type for Build-a-Bonus!");
    return null;
  }
  return _openWorkshop(object);
}

/**
 * Create a babonus in memory with the given data.
 * @param {object} data         An object of babonus data.
 * @param {Document5e} parent   The document to act as parent of the babonus.
 */
function createBabonus(data, parent = null) {
  return _createBabonus(data, undefined, {parent});
}

/**
 * Return the scene's token documents in three arrays split by disposition.
 * @param {Scene} scene       A scene that contains tokens.
 * @returns {object<array>}   An object of the three arrays.
 */
function sceneTokensByDisposition(scene) {
  const {HOSTILE, FRIENDLY, NEUTRAL} = CONST.TOKEN_DISPOSITIONS;
  return scene.tokens.reduce((acc, tokenDoc) => {
    const d = tokenDoc.disposition;
    if (d === HOSTILE) acc.hostiles.push(tokenDoc);
    else if (d === FRIENDLY) acc.friendlies.push(tokenDoc);
    else if (d === NEUTRAL) acc.neutrals.push(tokenDoc);
    return acc;
  }, {hostiles: [], friendlies: [], neutrals: []});
}

/**
 * Return all the upper left corners of all grid spaces one token occupies.
 * @param {TokenDocument5e} tokenDoc    The token document.
 * @returns {array<object>}             An array of x and y coordinate objects.
 */
function getOccupiedGridSpaces(tokenDoc) {
  return _getAllTokenGridSpaces(tokenDoc);
}

/**
 * Return a babonus using its uuid.
 * @param {string} uuid         The babonus uuid.
 * @returns {Promise<Babonus>}  The found babonus.
 */
async function fromUuid(uuid) {
  try {
    const parts = uuid.split(".");
    const id = parts.pop();
    parts.pop();
    const parentUuid = parts.join(".");
    const parent = await fromUuid(parentUuid);
    return getId(parent, id) ?? null;
  } catch (err) {
    console.warn(err);
    return null;
  }
}

/**
 * Return the collection of bonuses on the document.
 * @param {Document5e} object       An actor, item, effect, or template.
 * @returns {Collection<Babonus>}   A collection of babonuses.
 */
function getCollection(object) {
  return _getCollection(object);
}
