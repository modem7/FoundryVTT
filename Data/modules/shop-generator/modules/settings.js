import {Constants, RuntimeValues} from "./values.js";
import {getCompendiumsOfType} from "./utils/compendium_utils.js";

/**
 * Register all settings
 */
export function registerSettings() {
    // A setting for the user to select which compendium to use for the potion shop generation.
    game.settings.register(Constants.MODULE_ID, Constants.settings.potion_compendium,
        {
            name: "SHOP_GEN.settings.potion_compendium.name",
            hint: "SHOP_GEN.settings.potion_compendium.hint",
            scope: "user",
            requiresReload: true,
            type: String,
            choices: getCompendiumsOfType("item"),
            config: true,
            default: ""
        }
    );
    // A setting for the user to select which compendium contains spells present in magic shops as scrolls/gems
    game.settings.register(Constants.MODULE_ID, Constants.settings.spell_compendium,
        {
            name: "SHOP_GEN.settings.spell_compendium.name",
            hint: "SHOP_GEN.settings.spell_compendium.hint",
            scope: "user",
            requiresReload: true,
            type: String,
            choices: getCompendiumsOfType("item"),
            config: true,
            default: ""
        }
    );
    // A setting for the user to select which compendium contains magic items to be present in magic shops
    game.settings.register(Constants.MODULE_ID, Constants.settings.magic_item_compendium,
        {
            name: "SHOP_GEN.settings.magic_item_compendium.name",
            hint: "SHOP_GEN.settings.magic_item_compendium.hint",
            scope: "user",
            requiresReload: true,
            type: String,
            choices: getCompendiumsOfType("item"),
            config: true,
            default: ""
        }
    );
    // A setting for the user to select which compendium contains equipment like armor and weapons
    game.settings.register(Constants.MODULE_ID, Constants.settings.equipment_compendium,
        {
            name: "SHOP_GEN.settings.equipment_compendium.name",
            hint: "SHOP_GEN.settings.equipment_compendium.hint",
            scope: "user",
            requiresReload: true,
            type: String,
            choices: getCompendiumsOfType("item"),
            config: true,
            default: ""
        }
    );
    game.settings.register(Constants.MODULE_ID, Constants.settings.price_override,
        {
            name: "SHOP_GEN.settings.price_override.name",
            hint: "SHOP_GEN.settings.price_override.hint",
            scope: "user",
            requiresReload: true,
            type: String,
            config: true,
            default: ""
        }
    );
}

/**
 * A helper function that returns whether at least one of the settings is set to a valid compendium.
 * @returns {boolean}
 */
export function checkSettingsDefined() {
    for (const shopType of Object.keys(Constants.validShopTypes)) {
        if (game.settings.get(Constants.MODULE_ID, Constants["settings"][`${shopType}_compendium`]) !== "") {
            return true;
        }
    }
    return false;
}

/**
 * In order for the UI to not display shop types that we don't have a compendium set for, we use this
 */
export function setValidShopTypes(){
    for (const shopType of Object.keys(Constants.validShopTypes)) {
        if (game.settings.get(Constants.MODULE_ID, Constants["settings"][`${shopType}_compendium`]) !== "") {
            RuntimeValues.validShopTypes[shopType] = Constants.validShopTypes[shopType];
        }
    }
}
