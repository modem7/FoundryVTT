/**
 * Declares a handful of default values
 */
export class Constants {
    static MODULE_ID = "shop-generator";

    static VERSION_NUMBER = "0.0.1";

    static playerFlag = "shop_presets";

    static valid_compendium_types = [
        "actor",
        "item",
        "card stack",
        "journal entry",
        "macro",
        "playlist",
        "rollable table",
        "scene",
        "adventure"
    ];

    static settings = {
        potion_compendium: "PotionCompendium",
        spell_compendium: "SpellCompendium",
        magic_item_compendium: "MagicItemCompendium",
        equipment_compendium: "EquipmentCompendium",
        price_override: "PriceOverride"
    };

    static rarities = {
        common: "Common",
        uncommon: "Uncommon",
        rare: "Rare",
        veryrare: "Very Rare",
        legendary: "Legendary"
    };

    static validLogSeverities = ["log", "warn", "error", "info"];

    static validShopTypes = {
        "spell": {
            displayName: "Spell"
        },
        "potion": {
            displayName: "Potion"
        },
        "magic_item": {
            displayName: "Magic Item"
        },
        "equipment": {
            displayName: "Equipment"
        }
    }

    static templates = {
        shop_generator: `modules/${this.MODULE_ID}/templates/shop-generator.hbs`
    };

    static shopGenTemplateIDs = {
        shopType: "shopType",
        shopPreset: "shopPreset"
    };

    static spellLevels = {
        0: "Cantrip",
        1: "1st Level",
        2: "2nd Level",
        3: "3rd Level",
        4: "4th Level",
        5: "5th Level",
        6: "6th Level",
        7: "7th Level",
        8: "8th Level",
        9: "9th Level"
    };

    static validPriceOverrideFields = ["price"];
}

export class RuntimeValues {
    // We assume the price override to be invalid to be safe
    static validPriceOverride = false;
    static priceOverride = null;

    // Values used for shop generation
    static selectedShopType = null;
    static selectedPreset = null;
    static validPresets = null;
    static selectedPresetID = null;
    static selectedPresetName = null;

    static validShopTypes = {}
}