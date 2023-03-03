import {Constants, RuntimeValues} from "../values.js";
import {uiLogging,consoleLogging} from "./logging.js";

/**
 * Validates if the price override settings is a valid json string
 * NOTE: an empty string is not an error condition
 * @returns {boolean} Denoting if the price overrides value is a valid json string following required structure
 */
export function checkValidPriceOverride() {
    const jsonString = game.settings.get(Constants.MODULE_ID, Constants.settings.price_override);
    // If setting is empty, just return false
    if (jsonString === "") {
        consoleLogging("Price override setting empty", "log");
        RuntimeValues.validPriceOverride = false;
        return false;
    }
    let jsonObject = null;
    //Attempt conversion to JSON object
    try {
        jsonObject = JSON.parse(jsonString);
    } catch(e) {
        uiLogging("Invalid price override string. Invalid JSON", "error");
        RuntimeValues.validPriceOverride = false;
        return false;
    }
    // These track if we need to display a message to the user to view the console to see warnings/errors
    let hasWarnings = false;
    let hasErrors = false;
    // Iterate through each key (should be only four of these max, one for spells, equipment, magic items, and potions)
    for (const key of Object.keys(jsonObject)) {
        if (!Object.keys(Constants.validShopTypes).includes(key)) {
            consoleLogging(`${key} is not one of the valid shop types: ${Constants.validShopTypes.toString()}`, "warn");
            hasWarnings = true;
            continue;
        }
        // If the value is null, then we have a problem
        if (jsonObject[key] === null) {
            consoleLogging(`${key} is null`, "error");
            hasErrors = true;
            continue;
        }
        // If the value is not an object, we also have a problem
        // Really we only use one value in this object, but we expect an object here to allow for further expansion
        if (typeof jsonObject[key] !== "object") {
            consoleLogging(`The value of ${key} must be an object!`, "error");
            hasErrors = true;
            continue;
        }
        // Here we check that each of the required fields are present in the resulting object
        for (const field of Constants.validPriceOverrideFields) {
            // Iterate through each item
            for (const override of Object.keys(jsonObject[key])) {
                if (!Object.keys(jsonObject[key][override]).includes(field)) {
                    consoleLogging(`The values of ${key} do not included the required field: ${field}`, "error");
                    hasErrors = true;
                    continue;
                }
            }
        }
    }
    if (hasErrors) {
        uiLogging("Invalid price overrides! See console for further detail", "error");
        RuntimeValues.validPriceOverride = false;
        return false;
    }
    if (hasWarnings) {
        uiLogging("Warnings with price overrides. See console for further detail", "warn");
    }
    RuntimeValues.validPriceOverride = true;
    return true;
}

/**
 * A helper function that returns the price overrides as an OBJECt
 * DOES NOT VALIDATE PROPER STRUCTURE, AND ASSUMES VALID JSON
 * @returns {object} Price overrides as an object
 */
export function getPriceOverrideJSON() {
    return JSON.parse(game.settings.get(Constants.MODULE_ID, Constants.settings.price_override));
}

/**
 * A helper function that checks if pricing override json is valid, and then if it is, sets
 * a variable in the RunTime values to be the json -> object value
 */
export function initializePricingOverride() {
    let validPricing = checkValidPriceOverride();
    if (validPricing) {
        RuntimeValues.priceOverride = getPriceOverrideJSON();
    }
}

/**
 * Returns an items price as an integer, or -1 if no price is found
 * @param item Items as an object
 * @param type Type as a string
 * @returns {number|*} Price of item, or -1 if it cannot be found
 */
export function getObjectPrice(item, type) {
    // If we have a valid price override
    if (RuntimeValues.validPriceOverride && Object.keys(RuntimeValues.priceOverride).includes(type)) {
        // If item is a spell
        if (type === "spell") {
            // Check if the spells include a price of this level
            if(
                Object.keys(RuntimeValues.priceOverride.spell).includes(item.system.level.toString())
            ) {
                // Return the price of that spell
                return RuntimeValues.priceOverride.spell[item.system.level.toString()].price;
            }
        } else {
            if (
                Object.keys(RuntimeValues.priceOverride[type]).includes(item.name.toString())
            ) {
                // return the price of that item
                return RuntimeValues.priceOverride[type][item.name.toString()].price;
            }
        }
    }
    // If the price override isn't valid or the price doesn't exist, then we try to return item price
    if (item.system.price.value !== null && item.system.price.value !== 0) {
        return item.system.price.value;
    }
    // If the price is null, then return -1 to signify we don't have a price
    return -1
}