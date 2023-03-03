import {Constants} from "../values.js";

/**
 * A helper function that returns an object containing all present IDs and names for the specified type
 * @param type Shop Type
 * @returns {{Object}} {preset_id: {displayName: presentName}}
 */
export function getValidPresetsOfType(type) {
    let shopTypePresets = game.users.current.getFlag(Constants.MODULE_ID, Constants.playerFlag)["presets"][type];
    let presets = {};
    for (const key of Object.keys(shopTypePresets)) {
        presets[key] = {displayName: shopTypePresets[key].name};
    }
    return presets;
}

export async function setPlayerPresets(flagData) {
    await game.users.current.setFlag(Constants.MODULE_ID, Constants.playerFlag, flagData);
}

export function getPresetByName(type, name) {
    const flagData = game.users.current.getFlag(Constants.MODULE_ID, Constants.playerFlag)["presets"][type];
    for (const presetKey of Object.keys(flagData)) {
        if (flagData[presetKey]["name"] === name) {
            return flagData[presetKey];
        }
    }
    return null;
}

export function presetExist(type, presetID) {
    return Object.keys(game.users.current.getFlag(Constants.MODULE_ID, Constants.playerFlag)["presets"][type]).includes(presetID);
}

/**
 * A helper function that returns the specified preset as an object
 * @param type Shop Type
 * @param presetID The ID of the preset to be returned
 * @param removeFields Boolean of whether to remove name and default fields
 * @returns {{Object} Preset object
 */
export function getPreset(type, presetID, removeFields) {
    let preset = JSON.parse(JSON.stringify(game.users.current.getFlag(Constants.MODULE_ID, Constants.playerFlag)["presets"][type][presetID]));
    if (removeFields) {
        delete preset.name; // We delete the "name" key because it's useless in terms of rendering our options
        delete preset.default; // Same thing with the "default" attribute
    }
    return preset;
}