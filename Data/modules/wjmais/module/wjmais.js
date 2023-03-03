// Namespace Configuration Values
const WJMAIS = {};

WJMAIS.actorSizes = {
  tiny: "WJMAIS.SizeMegaTiny", // 0.5x0.5
  sm: "WJMAIS.SizeMegaSmall", // 1x1
  med: "WJMAIS.SizeMegaMedium", // 1x1
  lg: "WJMAIS.SizeMegaLarge", // 2x2
  huge: "WJMAIS.SizeMegaHuge", // 3x3
  grg: "WJMAIS.SizeMegaGargantuan", // 4x4
};

WJMAIS.shipClass = {
  tiny: "WJMAIS.ShipClassFighter",
  sm: "WJMAIS.ShipClassSchooner",
  med: "WJMAIS.ShipClassSloop",
  lg: "WJMAIS.ShipClassFrigate",
  huge: "WJMAIS.ShipClassHeavyFrigate",
  grg: "WJMAIS.ShipClassShipOfTheLine",
};

WJMAIS.shipModifiers = {
  tiny: { ac: 0, spd: 0, mnv: 0 },
  sm: { ac: 2, spd: 0, mnv: 45 },
  med: { ac: 4, spd: 0, mnv: 0 },
  lg: { ac: 5, spd: -500, mnv: 0 },
  huge: { ac: 6, spd: -1000, mnv: -45 },
  grg: { ac: 7, spd: -1500, mnv: -45 },
};

WJMAIS.shipRamDice = {
  tiny: 1,
  sm: 1,
  med: 2,
  lg: 3,
  huge: 4,
  grg: 0,
};

WJMAIS.mnvs = {
  0: 0,
  45: 45,
  90: 90,
  135: 135,
  180: 180,
  360: 360,
};

WJMAIS.landingTypes = {
  land: "WJMAIS.LandingLand",
  water: "WJMAIS.LandingWater",
  spacedock: "WJMAIS.LandingSpaceDock",
};

WJMAIS.bridgeCrewRoles = {
  captain: "WJMAIS.RoleCaptain",
  boatswain: "WJMAIS.RoleBoatswain",
  helmsman: "WJMAIS.RoleHelmsman",
  fighterhelmsman: "WJMAIS.RoleFighterHelmsman",
  gunner: "WJMAIS.RoleGunner",
  unassigned: "WJMAIS.RoleUnassigned",
};

WJMAIS.uniqueBridgeCrewRoles = [
  "captain",
  "boatswain",
  "fighterhelmsman",
  "helmsman",
];

WJMAIS.weaponMountLocation = {
  forward: "Forward",
  aft: "Aft",
  port: "Port (L)",
  starboard: "Starboard (R)",
};

WJMAIS.weaponMountFacing = {
  0: "0°",
  45: "45°",
  90: "90°",
  135: "135°",
  180: "180°",
  360: "None",
};

WJMAIS.crewValues = {
  cr1: 1,
  cr2: 2,
  cr3: 3,
  cr4: 4,
  cr5: 5,
  cr6: 6,
  cr8: 8,
};

WJMAIS.cargoTypes = [
  "consumable",
  "backpack",
  "equipment",
  "loot",
  "spell",
  "tool",
  "weapon",
];

function patchCompendiumImport() {
  // Override default system token bar values on wildjammer import from compendium.
  // We want token bars from the compendium to be used for ships to pick up BP.
  libWrapper.register(
    "wjmais",
    "WorldCollection.prototype.fromCompendium",
    function (wrapped, ...args) {
      if (!args[0].flags?.wjmais?.speed) return wrapped(...args);

      const prototypeToken = args[0].prototypeToken;
      const data = wrapped(...args);
      data.prototypeToken.bar1 = prototypeToken.bar1;
      data.prototypeToken.bar2 = prototypeToken.bar2;
      return data;
    },
    "MIXED"
  );
}

function patchItemSheet() {
  // Display wildjammer modules and upgrades as mountable items like vehicle equipment
  libWrapper.register(
    "wjmais",
    "game.dnd5e.applications.item.ItemSheet5e.prototype._isItemMountable",
    function (wrapped, ...args) {
      const armorType = this.document.system?.armor?.type;
      const wjEquipmentTypes = [
        "foremantle",
        "material",
        "modifier",
        "module",
        "upgrade",
      ];
      return wrapped(...args) || wjEquipmentTypes.includes(armorType);
    },
    "MIXED"
  );
}

function patchResourceBars() {
  // Add Bulwark Points bar attribute choice
  libWrapper.register(
    "wjmais",
    "TokenDocument.getTrackedAttributeChoices",
    function (wrapped, ...args) {
      // If no args then it's the default token settings config.
      // Init args with the default tracked attribute choices.
      if (!args[0]) args[0] = this.getTrackedAttributes();
      args[0].bar.push(["Bulwark Points"]);
      return wrapped(...args);
    },
    "MIXED"
  );

  // Get Bulwark Points attribute data
  libWrapper.register(
    "wjmais",
    "TokenDocument.prototype.getBarAttribute",
    function (wrapped, ...args) {
      const barName = args[0];
      const alternative = args[1]?.alternative;
      const attr = alternative || (barName ? this[barName].attribute : null);
      if (attr === "Bulwark Points") {
        const value = foundry.utils.getProperty(
          this.actor.system,
          "attributes.hp.temp"
        );
        const max = foundry.utils.getProperty(
          this.actor.system,
          "attributes.hp.tempmax"
        );
        const model = game.system.model.Actor[this.actor.type];
        return {
          type: "bar",
          attribute: "Bulwark Points",
          value: parseInt(value || 0),
          max: parseInt(max || 0),
          editable: foundry.utils.hasProperty(model, `attributes.hp.temp`),
        };
      } else return wrapped(...args);
    },
    "MIXED"
  );

  // Modify Bulwark Points bar attribute
  libWrapper.register(
    "wjmais",
    "Actor.prototype.modifyTokenAttribute",
    function (wrapped, ...args) {
      const attribute = args[0];
      let value = args[1];
      const isDelta = args[2];

      if (attribute === "Bulwark Points") {
        const currentValue = foundry.utils.getProperty(
          this.system,
          "attributes.hp.temp"
        );
        const currentMax = foundry.utils.getProperty(
          this.system,
          "attributes.hp.tempmax"
        );

        // Determine the updates to make to the actor data
        if (isDelta)
          value = Math.clamped(0, Number(currentValue) + value, currentMax);
        const updates = { [`system.attributes.hp.temp`]: value };

        return this.update(updates);
      } else return wrapped(...args);
    },
    "MIXED"
  );

  // Display raw HP bar for wildjammers
  libWrapper.register(
    "wjmais",
    "game.dnd5e.canvas.Token5e.prototype._drawBar",
    function (wrapped, ...args) {
      if (game.actors.get(this.document.actorId).flags?.wjmais?.traits)
        return Object.getPrototypeOf(
          game.dnd5e.canvas.Token5e
        ).prototype._drawBar.apply(this, args);
      else return wrapped(...args);
    },
    "MIXED"
  );

  // Display raw HP value for wildjammers
  libWrapper.register(
    "wjmais",
    "game.dnd5e.documents.TokenDocument5e.prototype.getBarAttribute",
    function (wrapped, ...args) {
      if (game.actors.get(this.actorId).flags?.wjmais?.traits)
        return Object.getPrototypeOf(
          game.dnd5e.documents.TokenDocument5e
        ).prototype.getBarAttribute.apply(this, args);
      else return wrapped(...args);
    },
    "MIXED"
  );
}

function patchRollData() {
  libWrapper.register(
    "wjmais",
    "game.dnd5e.documents.Actor5e.prototype.getRollData",
    function (wrapped, ...args) {
      const ship = game?.actors?.get(this.flags?.wjmais?.shipId);
      const size = ship ? ship.system.traits.size : this.system.traits.size;

      // Add @ship.ac.mod formula support
      this.system["ship"] = {
        ac: { mod: CONFIG.WJMAIS.shipModifiers[size].ac },
      };

      return wrapped(...args);
    },
    "MIXED"
  );
}

function patchProficiency() {
  libWrapper.register(
    "wjmais",
    "CONFIG.Actor.documentClass.prototype._prepareVehicleData",
    function (wrapped, ...args) {
      if (this.flags?.wjmais?.npc) wrapped(...args);
    },
    "MIXED"
  );
}

function applyPatches() {
  patchCompendiumImport();
  patchItemSheet();
  patchResourceBars();
  patchRollData();
  patchProficiency();
}

async function toggleConeOfMovement() {
  const token = TokenLayer.instance.controlled[0];
  if (!token) return;
  if (document.body !== document.activeElement) return;

  if (token.document.flags?.wjmais?.cone) {
    const template = canvas.scene.templates.get(
      token.document.flags.wjmais.cone
    );
    if (template) {
      await template.delete();
    }
    await token.document.unsetFlag("wjmais", "cone");
    return;
  }

  let rotation = token.document.rotation;
  // Normalize rotation to positive value
  // If the user rotates the token in place to the SE inter-cardinal direction, rotation is -45
  // Required on v10 builds before 10.285
  rotation = rotation < 0 ? 360 + rotation : rotation;
  const supportedAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  if (!supportedAngles.includes(rotation)) {
    return;
  }

  const supportedGridSizes = [5, 500];
  const gridSize = canvas.scene.grid.distance;
  if (!supportedGridSizes.includes(gridSize)) {
    ui.notifications.warn(
      "Cone of movement template requires a 5 or 500 foot grid."
    );
    return;
  }

  if (
    !token.actor.flags.wjmais.speed?.tactical ||
    !token.actor.flags.wjmais.speed?.mnv
  ) {
    ui.notifications.warn(
      "Cone of movement requires that the ship speed is configured."
    );
    return;
  }

  const tacticalSpeed = token.actor.flags.wjmais.speed.tactical;
  const distance = gridSize === 500 ? tacticalSpeed : tacticalSpeed / 100;

  const width = token.document.width;
  const height = token.document.height;
  const gridPixels = canvas.scene.grid.size;
  const offsets = {
    0: { x: (width * gridPixels) / 2, y: 0 },
    45: { x: width * gridPixels, y: 0 },
    90: { x: width * gridPixels, y: (height * gridPixels) / 2 },
    135: { x: width * gridPixels, y: height * gridPixels },
    180: { x: (width * gridPixels) / 2, y: height * gridPixels },
    225: { x: 0, y: height * gridPixels },
    270: { x: 0, y: (height * gridPixels) / 2 },
    315: { x: 0, y: 0 },
    // If the user rotates the token in place, rotation for S cardinal direction is 360 rather than 0
    // Required on v10 builds before 10.285
    360: { x: (width * gridPixels) / 2, y: 0 },
  };
  const data = {
    t: "cone",
    user: game.user.id,
    distance: distance + width * gridSize,
    angle: token.actor.flags.wjmais.speed.mnv,
    direction: rotation - 270,
    x: token.document.x + offsets[rotation].x,
    y: token.document.y + offsets[rotation].y,
    fillColor: game.user.color,
  };

  const doc = new MeasuredTemplateDocument(data, { parent: canvas.scene });
  const template = new game.dnd5e.canvas.AbilityTemplate(doc);
  const placedTemplate = await canvas.scene.createEmbeddedDocuments(
    "MeasuredTemplate",
    [template.document.toObject()]
  );

  await token.document.setFlag("wjmais", "cone", placedTemplate[0].id);
}

function registerMovementKey() {
  game.keybindings.register("wjmais", "coneOfMovement", {
    name: "Toggle Wildjammer cone of movement template",
    hint: "Toggle the Wildjammer cone of movement template for the selected token.",
    editable: [
      {
        key: "KeyM",
      },
    ],
    onDown: () => {
      toggleConeOfMovement();
      return true;
    },
  });
}

function _updateValue(old, change, add) {
  const value = parseInt(change);

  if (old === null) return value;

  if (add) return old + value;
  else return old - value;
}

// The actor effect helpers assume a numeric add mode effect

async function updateBulwarkPoints(effect, change, deleted) {
  const actor = effect.parent;
  const disabled = effect.disabled;
  if (deleted && disabled) return;
  const add = disabled || (deleted && !disabled) ? false : true;

  await actor.update({
    "system.attributes.hp.temp": _updateValue(
      actor.system.attributes.hp.temp,
      change.value,
      add
    ),
    "system.attributes.hp.tempmax": _updateValue(
      actor.system.attributes.hp.tempmax,
      change.value,
      add
    ),
  });
}

async function updateHullPoints(effect, change, deleted) {
  const actor = effect.parent;
  const disabled = effect.disabled;
  if (deleted && disabled) return;
  const add = disabled || (deleted && !disabled) ? false : true;

  await actor.update({
    "system.attributes.hp.value": _updateValue(
      actor.system.attributes.hp.value,
      change.value,
      add
    ),
    "system.attributes.hp.max": _updateValue(
      actor.system.attributes.hp.max,
      change.value,
      add
    ),
  });
}

async function updateActorEffects(effect, deleted = false) {
  if (effect.parent instanceof Actor) {
    let change = effect.changes.find((e) => e.key === "flags.wjmais.bp");
    if (change) await updateBulwarkPoints(effect, change, deleted);

    change = effect.changes.find((e) => e.key === "flags.wjmais.hp");
    if (change) await updateHullPoints(effect, change, deleted);
  }
}

/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor Sheet Partials
    "modules/wjmais/templates/actors/parts/actor-features.html",
    "modules/wjmais/templates/actors/parts/bridge-crew-roles.html",
  ]);
};

/**
 * A simple form to set wildjammer speeds
 * @implements {DocumentSheet}
 */
class WildjammerSpeedConfig extends DocumentSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["dnd5e"],
      template: "modules/wjmais/templates/actors/speed-config.html",
      width: 300,
      height: "auto",
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `${game.i18n.localize("WJMAIS.SpeedConfig")}: ${this.document.name}`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = {
      speed: this.document.flags.wjmais.speed,
      config: CONFIG.WJMAIS,
    };
    return data;
  }
}

/**
 * A Dialog to prompt the user to select from a list of items.
 * @type {Dialog}
 */
class SelectItemPrompt extends Dialog {
  constructor(items, dialogData = {}, options = {}) {
    super(dialogData, options);
    this.options.classes = ["dnd5e", "dialog", "select-items-prompt", "sheet"];

    /**
     * Store a reference to the Item entities being used
     * @type {Array<Item5e>}
     */
    this.items = items;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // render the item's sheet if its image is clicked
    html.on("click", ".item-image", (event) => {
      const item = this.items.find(
        (feature) => feature.id === event.currentTarget.dataset?.itemId
      );

      item?.sheet.render(true);
    });
  }

  /**
   * A constructor function which displays the AddItemPrompt app for a given Actor and Item set.
   * Returns a Promise which resolves to the dialog FormData once the workflow has been completed.
   * @param {Array<Item5e>} items
   * @param {Object} options
   * @param {string} options.hint - Localized hint to display at the top of the prompt
   * @return {Promise<string[]>} - list of item ids which the user has selected
   */
  static async create(items, { hint }) {
    const templateData = {
      config: CONFIG.WJMAIS,
      items: items,
    };
    // Check first item
    items[0].default = true;
    // Render the selection template
    const html = await renderTemplate(
      "modules/wjmais/templates/actors/select-item-prompt.html",
      { templateData, hint }
    );

    return new Promise((resolve) => {
      const dlg = new this(items, {
        title: game.i18n.localize("WJMAIS.SelectShipWeapon"),
        content: html,
        buttons: {
          apply: {
            icon: `<i class="fas fa-user-plus"></i>`,
            label: game.i18n.localize("WJMAIS.Apply"),
            callback: (html) => {
              const fd = new FormDataExtended(
                html[0].querySelector("form")
              ).toObject();
              const selectedId = fd["shipWeapon"];
              resolve(selectedId);
            },
          },
          cancel: {
            icon: '<i class="fas fa-forward"></i>',
            label: game.i18n.localize("WJMAIS.Skip"),
            callback: () => resolve([]),
          },
        },
        default: "apply",
        close: () => resolve([]),
      });
      dlg.render(true);
    });
  }
}

/**
 * Is the item a fore mantle module?
 * @param {Item5e} item   The item data object
 */
function isForeMantleModule(item) {
  return item.type === "equipment" && item.system?.armor?.type === "foremantle";
}

/**
 * Is the item a ship mounted weapon?
 * @param {Item5e} item   The item data object
 */
function isGunnerWeapon(item) {
  return (
    item.type === "weapon" &&
    item.system?.properties?.smw &&
    !item.system?.properties?.hlm
  );
}

/**
 * Is the item a helmsman weapon?
 * @param {Item5e} item   The item data object
 */
function isHelmsmanWeapon(item) {
  return item.type === "weapon" && item.system?.properties?.hlm;
}

/**
 * Is the item a crewed ship weapon?
 * @param {Item5e} item   The item data object
 */
function isShipWeaponCrewed(item) {
  return item.type === "weapon" && item.flags?.wjmais?.crewed;
}

/**
 * Is the role Fighter Helmsman or Gunner?
 * @param String   The role value
 */
function isFighterHelmsmanGunner(role) {
  return role === "fighterhelmsman" || role === "gunner";
}

/**
 * Is the role Helmsman?
 * @param String   The role value
 */
function isHelmsman(role) {
  return role === "helmsman";
}

async function isRoleChangeInvalid(role, ship, creature) {
  // Error if actor already assigned
  const creatureShipId = creature.flags?.wjmais?.shipId;
  if (creatureShipId && role != "unassigned") {
    const ship = game.actors.get(creature.flags.wjmais.shipId);
    if (ship) {
      ui.notifications.error(
        creature.name +
          game.i18n.localize("WJMAIS.ActorAlreadyAssigned") +
          (ship ? ship.name : "unknown ship")
      );
      return true;
    } else {
      await creature.unsetFlag("wjmais", "shipId");
    }
  }
  // Error if unique role filled
  if (
    CONFIG.WJMAIS.uniqueBridgeCrewRoles.includes(role) &&
    ship.items.toObject().some((i) => i.flags?.wjmais?.role === role)
  ) {
    ui.notifications.error(
      CONFIG.WJMAIS.bridgeCrewRoles[role] +
        game.i18n.localize("WJMAIS.RoleAlreadyFilled")
    );
    return true;
  }
}

async function notifyBridgeCrewRoleChange(ship, actor, role) {
  let roleChangeMessage;
  if (role === "unassigned") {
    roleChangeMessage =
      game.i18n.localize("WJMAIS.RoleIsUnassigned") + ship.name;
  } else {
    const roleName = game.i18n.localize(CONFIG.WJMAIS.bridgeCrewRoles[role]);
    roleChangeMessage =
      game.i18n.localize("WJMAIS.RoleIsAssigned") + ship.name + " ";
    if (isFighterHelmsmanGunner(role)) {
      const shipWeaponId = actor.items.find((i) => i.system?.properties?.smw)
        .flags?.wjmais?.swid;
      if (shipWeaponId)
        roleChangeMessage += ship.items.get(shipWeaponId).name + " ";
    }
    roleChangeMessage += roleName;
  }
  if (game.settings.get("wjmais", "roleChangeChat")) {
    await ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
      content: roleChangeMessage,
    });
  }
}

async function createCrewOwnedItem(item, ship, crewMember) {
  const itemData = duplicate(item);
  itemData.name = itemData.name + " (" + ship.name + ")";
  itemData.system.equipped = true;
  itemData.flags["wjmais.swid"] = item.id;
  await crewMember.createEmbeddedDocuments("Item", [itemData]);
  await item.setFlag("wjmais", "crewed", crewMember.id);
}

async function updateRole(creature, ship, role) {
  const currentRole = creature.flags?.wjmais?.role;

  // Uncrew and delete all owned ship items when leaving F-H, Gunner, or Helmsman roles
  if (isFighterHelmsmanGunner(currentRole) || isHelmsman(currentRole)) {
    for (const item of creature.items.filter((i) => i.flags?.wjmais?.swid)) {
      const shipItem = await ship.items.get(item.flags?.wjmais?.swid);
      await shipItem.unsetFlag("wjmais", "crewed");
      await item.delete();
    }
  }

  if (isFighterHelmsmanGunner(role)) {
    const shipWeapons = ship.items.filter(
      (i) => isGunnerWeapon(i) && !isShipWeaponCrewed(i)
    );

    if (shipWeapons.length === 0) {
      ui.notifications.warn(
        ship.name + game.i18n.localize("WJMAIS.ShipHasNoWeapons")
      );
      return false;
    }

    let shipWeapon = shipWeapons[0];
    // Prompt if there's more than one ship weapon to choose from
    if (shipWeapons.length > 1) {
      const shipWeaponId = await SelectItemPrompt.create(shipWeapons, {});
      shipWeapon = ship.items.get(shipWeaponId);
    }

    if (shipWeapon) await createCrewOwnedItem(shipWeapon, ship, creature);
  }

  if (isHelmsman(role)) {
    // Helmsman owns multiple ship items
    for (const item of ship.items.filter(
      (i) => isHelmsmanWeapon(i) || isForeMantleModule(i)
    )) {
      await createCrewOwnedItem(item, ship, creature);
    }
  }

  if (role === "unassigned") await creature.unsetFlag("wjmais", "shipId");
  else await creature.setFlag("wjmais", "shipId", ship.id);

  await creature.setFlag("wjmais", "role", role);

  return true;
}

/**
 * An Actor sheet for Wildjammer vehicle type actors.
 * Extends the base ActorSheet5e class.
 * @type {ActorSheet5e}
 */
class WildjammerSheet extends dnd5e.applications.actor
  .ActorSheet5e {
  /**
   * Define default rendering options for the Vehicle sheet.
   * @returns {Object}
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["dnd5e", "sheet", "actor", "vehicle"],
      width: 680,
      height: 680,
    });
  }

  /**
   * Prepare the data structure for traits data like languages, resistances & vulnerabilities, and proficiencies
   * @param {object} traits   The raw traits data object from the actor data
   * @private
   */
  _prepareTraits(traits) {
    const map = {
      lt: CONFIG.WJMAIS.landingTypes,
    };
    for (let [t, choices] of Object.entries(map)) {
      if (!traits) break;
      const trait = traits[t];
      if (!trait) continue;
      let values = [];
      if (trait.value) {
        values = trait.value instanceof Array ? trait.value : [trait.value];
      }
      trait.selected = values.reduce((obj, t) => {
        obj[t] = choices[t];
        return obj;
      }, {});
      // Add custom entry
      if (trait.custom) {
        trait.custom
          .split(";")
          .forEach((c, i) => (trait.selected[`custom${i + 1}`] = c.trim()));
      }
      trait.cssClass = !isEmpty(trait.selected) ? "" : "inactive";
    }
  }

  async getData(options) {
    const context = await super.getData(options);

    const actorFlags = this.actor.flags;
    if (!actorFlags?.wjmais) actorFlags["wjmais"] = {};
    if (!actorFlags?.wjmais?.traits)
      actorFlags["wjmais"]["traits"] = { lt: { value: ["spacedock"] } };
    if (!actorFlags?.wjmais?.speed)
      actorFlags["wjmais"]["speed"] = { tactical: 0, mnv: 0 };
    this._prepareTraits(actorFlags.wjmais.traits);

    context.flags = actorFlags;
    context.config = CONFIG.WJMAIS;
    context.isNPC = actorFlags?.wjmais?.npc;
    context.isGM = game.user.isGM;

    return context;
  }

  /* -------------------------------------------- */

  /**
   * Get the correct HTML template path to use for rendering this particular sheet
   * @type {String}
   */
  get template() {
    return "modules/wjmais/templates/actors/wildjammer.html";
  }

  /* -------------------------------------------- */

  /** @override */
  async _onDropActor(event, data) {
    let actor = await fromUuid(data.uuid);
    if (!actor) return;

    const itemData = {
      name: actor.name,
      type: "feat",
      img: actor.img,
      data: duplicate({}),
      flags: { wjmais: { role: "unassigned", actorId: actor.id } },
    };
    delete itemData.data["type"];

    if (actor.type === "vehicle") {
      ui.notifications.error(game.i18n.localize("WJMAIS.NoShipPolymorph"));
      return;
    }

    // DnD actor to a bridge crew role
    for (const [role] of Object.entries(CONFIG.WJMAIS.bridgeCrewRoles)) {
      if (event.target.classList.contains(role) || role === "unassigned") {
        // Error if actor dropped from compendium
        if (actor.pack) {
          ui.notifications.error(
            game.i18n.localize("WJMAIS.CompendiumActorRole")
          );
          return;
        }
        if (await isRoleChangeInvalid(role, this.actor, actor)) return;
        itemData.flags.wjmais.role = role;
        itemData.description = { value: CONFIG.WJMAIS.bridgeCrewRoles[role] };
        if (!(await updateRole(actor, this.actor, role))) return;
        await this.actor.createEmbeddedDocuments("Item", [itemData]);
        await notifyBridgeCrewRoleChange(this.actor, actor, role);
        return;
      }
    }
  }

  /** @override */
  async _onDropItem(event, itemData) {
    const item = await fromUuid(itemData.uuid);
    // DnD bridge crew to another bridge crew role
    if (item.flags?.wjmais?.role) {
      for (const [role] of Object.entries(CONFIG.WJMAIS.bridgeCrewRoles)) {
        if (event.target.classList.contains(role)) {
          const creature = game.actors.get(item.flags.wjmais.actorId);
          if (creature) {
            if (await isRoleChangeInvalid(role, this.actor, creature)) break;
            if (!(await updateRole(creature, this.actor, role))) break;
            await item.update({ flags: { wjmais: { role: role } } });
            await notifyBridgeCrewRoleChange(this.actor, creature, role);
            break;
          }
        }
      }
    } else {
      return super._onDropItem(event, itemData);
    }
  }

  /** @override */
  async _onDropItemCreate(itemData) {
    if (itemData.type === "weapon") {
      if (itemData.system.properties.smw) {
        foundry.utils.setProperty(itemData, "flags.wjmais.location", "forward");
        foundry.utils.setProperty(itemData, "flags.wjmais.facing", 90);
      }
      if (itemData.system.properties.ram) {
        const ramDiceNum =
          CONFIG.WJMAIS.shipRamDice[this.actor.system.traits.size];
        if (itemData.system.damage.parts.length > 1) {
          const ramDamageDie = Roll.parse(itemData.system.damage.parts[0][0])[0]
            .faces;
          const backlashDamageDie = Roll.parse(
            itemData.system.damage.parts[1][0]
          )[0].faces;
          foundry.utils.setProperty(itemData, "system.damage.parts", [
            [
              `${ramDiceNum}d${ramDamageDie}`,
              itemData.system.damage.parts[0][1],
            ],
            [
              `${ramDiceNum}d${backlashDamageDie}`,
              itemData.system.damage.parts[1][1],
            ],
          ]);
        } else if (itemData.system.damage.parts.length > 0) {
          const ramDamageDie = Roll.parse(itemData.system.damage.parts[0][0])[0]
            .faces;
          foundry.utils.setProperty(itemData, "system.damage.parts", [
            [
              `${ramDiceNum}d${ramDamageDie}`,
              itemData.system.damage.parts[0][1],
            ],
          ]);
        }
        if (itemData.system.damage.versatile) {
          const backlashDamageDie = Roll.parse(
            itemData.system.damage.versatile
          )[0].faces;
          foundry.utils.setProperty(
            itemData,
            "system.damage.versatile",
            `${ramDiceNum}d${backlashDamageDie}`
          );
        }
      }
    }
    return super._onDropItemCreate(itemData);
  }

  _onItemRoll(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (this._isRollable(item)) super._onItemRoll(event);
  }

  /**
   * Creates a new cargo entry for a vehicle Actor.
   * @type {object}
   */
  static get newCargo() {
    return { name: "", quantity: 1 };
  }

  /* -------------------------------------------- */

  /**
   * Compute the total weight of the vehicle's cargo.
   * @param {Number} totalWeight    The cumulative item weight from inventory items
   * @param {Object} actorData      The data object for the Actor being rendered
   * @returns {{max: number, value: number, pct: number}}
   * @private
   */
  _computeEncumbrance(totalWeight, actorData) {
    // Compute currency weight
    const totalCoins = Object.values(actorData.system.currency).reduce(
      (acc, denom) => acc + denom,
      0
    );
    totalWeight +=
      totalCoins / CONFIG.DND5E.encumbrance.currencyPerWeight.imperial;

    // Compute overall encumbrance
    const max = actorData.actor.flags?.wjmais?.cargo * 2000;
    const pct = Math.clamped((totalWeight * 100) / max, 0, 100);
    return { value: totalWeight.toNearest(0.1), max, pct };
  }

  /* -------------------------------------------- */

  /** @override */
  _getMovementSpeed(actorData, largestPrimary = true) {
    return super._getMovementSpeed(actorData, largestPrimary);
  }

  /* -------------------------------------------- */

  /**
   * Prepare items that are mounted to a vehicle and are equippable.
   * @private
   */
  _prepareEquippableItem(item) {
    const isEquipped = item.system.equipped;
    item.toggleClass = isEquipped ? "active" : "";
    item.toggleTitle = game.i18n.localize(
      `DND5E.${isEquipped ? "Equipped" : "Unequipped"}`
    );
  }

  /**
   * Remove actor role
   * @param {Item} item   The role item
   * @private
   */
  async _doRemoveRole(item) {
    const actor = game.actors.get(item.flags.wjmais.actorId);
    await updateRole(actor, this.actor, "unassigned");
    notifyBridgeCrewRoleChange(actor, "unassigned");
  }

  /**
   * Is ship an NPC?
   * @private
   */
  _isNPC() {
    return this.actor.flags?.wjmais?.npc;
  }

  /**
   * Is the item rollable?
   * @param {ItemData} itemData   The item data object
   * @private
   */
  _isRollable(item) {
    if (this._isNPC()) return true;

    if (
      (item.system?.properties?.smw ||
        item.system?.armor?.type === "foremantle") &&
      !game.settings.get("wjmais", "rollPcWeapons")
    )
      return false;

    return true;
  }

  /**
   * Get required crew from weapon properties.
   * @private
   */
  _getCrewValue(item) {
    let value = 0;
    const crewProperty = Object.keys(CONFIG.WJMAIS.crewValues).find(
      (prop) => item.system.properties[prop]
    );
    if (crewProperty) value = CONFIG.WJMAIS.crewValues[crewProperty];
    return value;
  }

  /* -------------------------------------------- */

  /**
   * Organize Owned Items for rendering the Vehicle sheet.
   * @private
   */
  _prepareItems(context) {
    const cargoColumns = [
      {
        label: game.i18n.localize("DND5E.Quantity"),
        css: "item-qty",
        property: "quantity",
        editable: "Number",
      },
    ];

    const moduleColumns = [
      {
        label: game.i18n.localize("DND5E.Weight"),
        css: "item-weight",
        property: "system.weight",
        editable: "Number",
      },
      {
        label: game.i18n.localize("DND5E.HP"),
        css: "item-hp",
        property: "system.hp.value",
        editable: "Number",
      },
    ];

    const upgradeColumns = [
      {
        label: game.i18n.localize("DND5E.Quantity"),
        css: "item-qty",
        property: "system.quantity",
      },
    ];

    const weaponColumns = [
      {
        label: game.i18n.localize("WJMAIS.WeaponMountFacing"),
        css: "item-facing",
        visible: "system.properties.fxd",
        property: "flags.wjmais.facing",
        table: CONFIG.WJMAIS.weaponMountFacing,
        editable: true,
      },
      {
        label: game.i18n.localize("WJMAIS.WeaponMountLocation"),
        css: "item-location",
        visible: "system.properties.smw",
        property: "flags.wjmais.location",
        table: CONFIG.WJMAIS.weaponMountLocation,
        editable: true,
      },
      {
        label: game.i18n.localize("WJMAIS.Crew"),
        css: "item-crew",
        property: "crewValue",
      },
      {
        label: game.i18n.localize("DND5E.HP"),
        css: "item-hp",
        property: "system.hp.value",
        editable: "Number",
      },
    ];

    const features = {
      actions: {
        label: game.i18n.localize("DND5E.ActionPl"),
        items: [],
        equippable: true,
        dataset: { type: "feat", "activation.type": "crew" },
      },
      passive: {
        label: game.i18n.localize("DND5E.Features"),
        items: [],
        equippable: true,
        dataset: { type: "feat" },
      },
      hull: {
        label: game.i18n.localize("WJMAIS.ItemTypeHull"),
        items: [],
        equippable: true,
        dataset: {
          type: "equipment",
          "armor.type": "material",
          "armor.value": "",
          "hp.max": 10,
          "hp.value": 10,
        },
      },
      modules: {
        label: game.i18n.localize("WJMAIS.ItemTypeModules"),
        items: [],
        equippable: true,
        dataset: {
          type: "equipment",
          "armor.type": "module",
          "armor.value": "",
          "hp.max": 10,
          "hp.value": 10,
        },
        columns: moduleColumns,
      },
      reactions: {
        label: game.i18n.localize("DND5E.ReactionPl"),
        items: [],
        equippable: true,
        dataset: { type: "feat", "activation.type": "reaction" },
      },
      upgrades: {
        label: game.i18n.localize("WJMAIS.ItemTypeUpgrades"),
        items: [],
        equippable: true,
        dataset: {
          type: "equipment",
          "armor.type": "upgrade",
          "armor.value": "",
        },
        columns: upgradeColumns,
      },
      weapons: {
        label: game.i18n.localize("ITEM.TypeWeaponPl"),
        items: [],
        equippable: true,
        dataset: {
          type: "weapon",
          "properties.smw": true,
          "action-type": "mwak",
          "hp.max": 10,
          "hp.value": 10,
        },
        columns: weaponColumns,
      },
    };

    const cargo = {
      crew: {
        label: game.i18n.localize("DND5E.VehicleCrew"),
        items: context.actor.system.cargo.crew,
        css: "cargo-row crew",
        editableName: true,
        dataset: { type: "crew" },
        columns: cargoColumns,
      },
      passengers: {
        label: game.i18n.localize("DND5E.VehiclePassengers"),
        items: context.actor.system.cargo.passengers,
        css: "cargo-row passengers",
        editableName: true,
        dataset: { type: "passengers" },
        columns: cargoColumns,
      },
      cargo: {
        label: game.i18n.localize("DND5E.VehicleCargo"),
        items: [],
        dataset: { type: "loot" },
        columns: [
          {
            label: game.i18n.localize("DND5E.Quantity"),
            css: "item-qty",
            property: "system.quantity",
            editable: "Number",
          },
          {
            label: game.i18n.localize("DND5E.Price"),
            css: "item-price",
            property: "system.price",
            editable: "Number",
          },
          {
            label: game.i18n.localize("DND5E.Weight"),
            css: "item-weight",
            property: "system.weight",
            editable: "Number",
          },
        ],
      },
    };

    const fighterRoles = {
      fighterhelmsman: {
        role: "fighterhelmsman",
        label: game.i18n.localize("WJMAIS.RoleFighterHelmsman"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "fighterhelmsman" },
      },
      unassigned: {
        role: "unassigned",
        label: game.i18n.localize("WJMAIS.RoleUnassigned"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "unassigned" },
      },
    };

    const shipRoles = {
      captain: {
        role: "captain",
        label: game.i18n.localize("WJMAIS.RoleCaptain"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "captain" },
      },
      helmsman: {
        role: "helmsman",
        label: game.i18n.localize("WJMAIS.RoleHelmsman"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "helmsman" },
      },
      boatswain: {
        role: "boatswain",
        label: game.i18n.localize("WJMAIS.RoleBoatswain"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "boatswain" },
      },
      gunner: {
        role: "gunner",
        label: game.i18n.localize("WJMAIS.RoleGunner"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "gunner" },
      },
      unassigned: {
        role: "unassigned",
        label: game.i18n.localize("WJMAIS.RoleUnassigned"),
        items: [],
        dataset: { type: "feat", "flags.wjmais.role": "unassigned" },
      },
    };

    let totalWeight = 0;
    const roles =
      this.actor.system.traits.size === "tiny" ? fighterRoles : shipRoles;

    for (const item of context.items) {
      this._prepareEquippableItem(item);
      item["rollable"] = this._isRollable(item);
      if (item.type === "weapon" && item.system?.properties.smw) {
        item["crewValue"] = this._getCrewValue(item);
        features.weapons.items.push(item);
      } else if (
        item.type === "equipment" &&
        ["foremantle", "module"].includes(item.system?.armor.type)
      ) {
        totalWeight += (item.system.weight || 0) * (item.system.quantity || 0);
        features.modules.items.push(item);
      } else if (
        item.type === "equipment" &&
        item.system?.armor.type === "upgrade"
      )
        features.upgrades.items.push(item);
      else if (
        item.type === "equipment" &&
        ["material", "modifier"].includes(item.system?.armor.type)
      )
        features.hull.items.push(item);
      else if (CONFIG.WJMAIS.cargoTypes.includes(item.type)) {
        totalWeight += (item.system.weight || 0) * (item.system.quantity || 0);
        cargo.cargo.items.push(item);
      } else if (item.type === "feat") {
        if (item?.flags?.wjmais?.role) {
          roles[item.flags.wjmais.role].items.push(item);
        } else if (
          !item.system.activation.type ||
          item.system.activation.type === "none"
        ) {
          features.passive.items.push(item);
        } else if (item.system.activation.type === "reaction")
          features.reactions.items.push(item);
        else features.actions.items.push(item);
      }
    }

    context.roles = Object.values(roles);
    context.features = Object.values(features);
    context.cargo = Object.values(cargo);
    context.actor.system.attributes.encumbrance = this._computeEncumbrance(
      totalWeight,
      context
    );
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    let actor = this.actor;

    if (!this.options.editable) return;

    html.find(".item-toggle").click(this._onToggleItem.bind(this));
    html.find(".item-facing select").change(async (event) => {
      event.preventDefault();
      const itemID = event.currentTarget.closest(".item").dataset.itemId;
      const item = actor.items.get(itemID);
      let value =
        event.target.options[event.target.options.selectedIndex].value;
      await item.setFlag("wjmais", "facing", value);
    });

    html.find(".item-location select").change(async (event) => {
      event.preventDefault();
      const itemID = event.currentTarget.closest(".item").dataset.itemId;
      const item = actor.items.get(itemID);
      let value =
        event.target.options[event.target.options.selectedIndex].value;
      await item.setFlag("wjmais", "location", value);
    });

    html
      .find(".item-hp input")
      .click((evt) => evt.target.select())
      .change(this._onHPChange.bind(this));

    html
      .find(".item:not(.cargo-row) input[data-property]")
      .click((evt) => evt.target.select())
      .change(this._onEditInSheet.bind(this));

    html
      .find(".cargo-row input")
      .click((evt) => evt.target.select())
      .change(this._onCargoRowChange.bind(this));

    html.find(".armor-config-button").click(super._onConfigMenu.bind(this));
    html.find(".speed-config-button").click(this._onSpeedConfigMenu.bind(this));

    html
      .find(".trait-selector-landing")
      .click(this._onTraitSelector.bind(this));

    html.find(".npc-toggle input").change(this._onNPCChanged.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle saving a cargo row (i.e. crew or passenger) in-sheet.
   * @param event {Event}
   * @returns {Promise<Actor>|null}
   * @private
   */
  _onCargoRowChange(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const row = target.closest(".item");
    const idx = Number(row.dataset.itemIndex);
    const property = row.classList.contains("crew") ? "crew" : "passengers";

    // Get the cargo entry
    const cargo = foundry.utils.deepClone(this.actor.system.cargo[property]);
    const entry = cargo[idx];
    if (!entry) return null;

    // Update the cargo value
    const key = target.dataset.property || "name";
    const type = target.dataset.dtype;
    let value = target.value;
    if (type === "Number") value = Number(value);
    entry[key] = value;

    // Perform the Actor update
    return this.actor.update({ [`system.cargo.${property}`]: cargo });
  }

  /* -------------------------------------------- */

  /**
   * Handle editing certain values like quantity, price, and weight in-sheet.
   * @param event {Event}
   * @returns {Promise<Item>}
   * @private
   */
  _onEditInSheet(event) {
    event.preventDefault();
    const itemID = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemID);
    const property = event.currentTarget.dataset.property;
    const type = event.currentTarget.dataset.dtype;
    let value = event.currentTarget.value;
    switch (type) {
      case "Number":
        value = parseInt(value);
        break;
      case "Boolean":
        value = value === "true";
        break;
    }
    return item.update({ [`${property}`]: value });
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new crew or passenger row.
   * @param event {Event}
   * @returns {Promise<Actor|Item>}
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    // Handle creating a new crew or passenger row.
    const target = event.currentTarget;
    const type = target.dataset.type;
    if (type === "crew" || type === "passengers") {
      const cargo = foundry.utils.deepClone(this.actor.system.cargo[type]);
      cargo.push(this.constructor.newCargo);
      return this.actor.update({ [`system.cargo.${type}`]: cargo });
    }
    return super._onItemCreate(event);
  }

  /* -------------------------------------------- */

  /**
   * Handle deleting a crew/passenger row, roles, and ship weapons.
   * @param event {Event}
   * @returns {Promise<Actor|Item>}
   * @private
   */
  async _onItemDelete(event) {
    event.preventDefault();
    const row = event.currentTarget.closest(".item");
    const item = this.actor.items.get(row.dataset.itemId);
    if (row.classList.contains("cargo-row")) {
      const idx = Number(row.dataset.itemIndex);
      const type = row.classList.contains("crew") ? "crew" : "passengers";
      const cargo = foundry.utils
        .deepClone(this.actor.system.cargo[type])
        .filter((_, i) => i !== idx);
      return this.actor.update({ [`system.cargo.${type}`]: cargo });
    } else if (item.flags?.wjmais?.role) {
      this._doRemoveRole(item);
    } else if (isGunnerWeapon(item)) {
      const creature = game.actors.get(item.flags?.wjmais?.crewed);
      if (creature) {
        const creatureShipWeapon = creature.items.find(
          (i) => i.flags.wjmais?.swid
        );
        if (creatureShipWeapon) await creatureShipWeapon.delete();
      }
    }

    return super._onItemDelete(event);
  }

  /* -------------------------------------------- */

  /**
   * Special handling for editing HP to clamp it within appropriate range.
   * @param event {Event}
   * @returns {Promise<Item>}
   * @private
   */
  _onHPChange(event) {
    event.preventDefault();
    const itemID = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemID);
    const hp = Math.clamped(
      0,
      parseInt(event.currentTarget.value),
      item.system.hp.max
    );
    event.currentTarget.value = hp;
    return item.update({ "system.hp.value": hp });
  }

  /**
   * When entering NPC mode, remove all existing bridge crew roles
   * @param event {Event}
   * @private
   */
  async _onNPCChanged(event) {
    if (event.target.checked) {
      this.actor.items
        .filter((i) => i.flags?.wjmais?.role)
        .forEach(async (item) => {
          await this._doRemoveRole(item);
          await item.delete();
        });
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle spawning the TraitSelector application which allows a checkbox of multiple trait options
   * @param {Event} event   The click event which originated the selection
   * @private
   */
  _onSpeedConfigMenu(event) {
    event.preventDefault();
    const button = event.currentTarget;
    switch (button.dataset.action) {
      case "speed":
        new WildjammerSpeedConfig(this.object).render(true);
        break;
    }
  }

  /**
   * Handle spawning the TraitSelector application which allows a checkbox of multiple trait options
   * @param {Event} event   The click event which originated the selection
   * @private
   */
  _onTraitSelector(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const label = a.parentElement.querySelector("label");
    const choices = CONFIG.WJMAIS[a.dataset.options];
    const options = {
      name: a.dataset.target,
      title: label.innerText,
      choices,
      allowCustom: false,
    };
    new dnd5e.applications.TraitSelector(this.actor, options).render(true);
  }

  /**
   * Handle toggling an item's equipped status.
   * @param event {Event}
   * @returns {Promise<Item>}
   * @private
   */
  _onToggleItem(event) {
    event.preventDefault();
    const itemID = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemID);
    const equipped = !!item.system.equipped;
    return item.update({ "system.equipped": !equipped });
  }
}

// Register Wildjammer Sheet and make it the default vehicle sheet
Actors.registerSheet("wjmais", WildjammerSheet, {
  label: "WJMAIS.WildjammerSheet",
  types: ["vehicle"],
  makeDefault: true,
});

function localize(stringId, data = {}) {
  return game.i18n.format(stringId, data);
}

function translateObject(obj) {
  /* translate in place */
  Object.keys(obj).forEach((key) => (obj[key] = localize(obj[key])));

  return obj;
}

function configProperties() {
  mergeObject(globalThis.game.dnd5e.config.armorClasses, {
    wildjammer: {
      label: localize("WJMAIS.Wildjammer"),
      formula: "10 + @ship.ac.mod",
    },
  });

  mergeObject(
    globalThis.game.dnd5e.config.equipmentTypes,
    translateObject({
      foremantle: "WJMAIS.ForeMantleModule",
      material: "WJMAIS.HullMaterial",
      modifier: "WJMAIS.HullModifier",
      module: "WJMAIS.ShipModule",
      upgrade: "WJMAIS.ShipUpgrade",
    })
  );

  mergeObject(
    globalThis.game.dnd5e.config.miscEquipmentTypes,
    translateObject({
      foremantle: "WJMAIS.ForeMantleModule",
      material: "WJMAIS.HullMaterial",
      modifier: "WJMAIS.HullModifier",
      module: "WJMAIS.ShipModule",
      upgrade: "WJMAIS.ShipUpgrade",
    })
  );

  mergeObject(globalThis.game.dnd5e.config.spellTags, {
    megascale: {
      label: localize("WJMAIS.Megascale"),
      abbr: localize("WJMAIS.MegascaleAbbr"),
    },
  });

  mergeObject(
    globalThis.game.dnd5e.config.weaponProperties,
    translateObject({
      bf1: "WJMAIS.WeaponPropertyBackfire1",
      bf2: "WJMAIS.WeaponPropertyBackfire2",
      bf3: "WJMAIS.WeaponPropertyBackfire3",
      bf4: "WJMAIS.WeaponPropertyBackfire4",
      clb: "WJMAIS.WeaponPropertyClimbing",
      dpl: "WJMAIS.WeaponPropertyDeployable",
      cr1: "WJMAIS.WeaponPropertyCrew1",
      cr2: "WJMAIS.WeaponPropertyCrew2",
      cr3: "WJMAIS.WeaponPropertyCrew3",
      cr4: "WJMAIS.WeaponPropertyCrew4",
      cr5: "WJMAIS.WeaponPropertyCrew5",
      cr6: "WJMAIS.WeaponPropertyCrew6",
      cr7: "WJMAIS.WeaponPropertyCrew7",
      cr8: "WJMAIS.WeaponPropertyCrew8",
      fmm: "WJMAIS.WeaponPropertyForeMantleModule",
      fxd: "WJMAIS.WeaponPropertyFixed",
      hlm: "WJMAIS.WeaponPropertyHelmsman",
      hps: "WJMAIS.WeaponPropertyHardpointSmall",
      hpm: "WJMAIS.WeaponPropertyHardpointMedium",
      hpl: "WJMAIS.WeaponPropertyHardpointLarge",
      ovh: "WJMAIS.WeaponPropertyOverheat",
      sc1d12: "WJMAIS.WeaponPropertyScatter112",
      sc2d6: "WJMAIS.WeaponPropertyScatter26",
      sc2d10: "WJMAIS.WeaponPropertyScatter210",
      smw: "WJMAIS.WeaponPropertyShipWeapon",
      ram: "WJMAIS.WeaponPropertyRam",
    })
  );
}

function registerSettings() {
  game.settings.register("wjmais", "rollPcWeapons", {
    name: "SETTINGS.WJMAIS.RollPcWeaponsN",
    hint: "SETTINGS.WJMAIS.RollPcWeaponsH",
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
  });
  game.settings.register("wjmais", "roleChangeChat", {
    name: "SETTINGS.WJMAIS.RoleChangeChatN",
    hint: "SETTINGS.WJMAIS.RoleChangeChatH",
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
  });
}

function updateLogo() {
  document.getElementById("logo").src =
    "modules/wjmais/assets/wj-logo-banner.webp";
  document.getElementById("logo").style = "left: 12px; top: 12px";
}

Hooks.once("init", function () {
  if (!game.modules.get("lib-wrapper")?.active && game.user.isGM) {
    ui.notifications.error(
      "Module wjmais requires the 'libWrapper' module. Please install and activate it."
    );
    return;
  }

  applyPatches();

  console.log("wjmais | Initializing Wildjammer: More Adventures in Space");

  CONFIG.WJMAIS = WJMAIS;

  registerMovementKey();

  registerSettings();

  preloadHandlebarsTemplates();

  updateLogo();

  /**
   * This function runs after game data has been requested and loaded from the servers, so entities exist
   */
  Hooks.once("setup", function () {
    configProperties();

    // Localize WJMAIS objects once up-front
    const toLocalize = [
      "actorSizes",
      "bridgeCrewRoles",
      "landingTypes",
      "shipClass",
    ];

    // Exclude some from sorting where the default order matters
    const noSort = [""];

    // Localize and sort WJMAIS objects
    for (let o of toLocalize) {
      const localized = Object.entries(WJMAIS[o]).map((e) => {
        return [e[0], game.i18n.localize(e[1])];
      });
      if (!noSort.includes(o))
        localized.sort((a, b) => a[1].localeCompare(b[1]));
      WJMAIS[o] = localized.reduce((obj, e) => {
        obj[e[0]] = e[1];
        return obj;
      }, {});
    }
  });

  Hooks.on("ready", () => {
    $("#logo").click(async () => {
      const pack = await game.packs.get("wjmais.quickref");
      const quickref = pack.index.getName("Wildjammer Quick Reference");
      if (quickref) {
        const quickrefDocument = await pack.getDocument(quickref._id);
        quickrefDocument.sheet.render(true);
      }
    });
  });

  Hooks.on("createActiveEffect", (effect) => {
    updateActorEffects(effect);
  });

  Hooks.on("deleteActiveEffect", (effect) => {
    updateActorEffects(effect, true);
  });

  Hooks.on("updateActiveEffect", (effect) => {
    updateActorEffects(effect);
  });
});
//# sourceMappingURL=wjmais.js.map
