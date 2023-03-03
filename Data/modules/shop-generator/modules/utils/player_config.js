import {Constants} from "../values.js";

/*
    A function used as a helper function to load data from the presets.json file into the current users data
    This is also used to update the players data if the presets.json is updated
*/
export async function setDefaultPresets() {
    // Load the JSON data
    const jsonData = await foundry.utils.fetchJsonWithTimeout(`modules/${Constants.MODULE_ID}/modules/presets.json`);
    let playerFlagData = game.users.current.getFlag(Constants.MODULE_ID, Constants.playerFlag);
    // If the player does not have the data flagged, set it as the raw json data.
    if (playerFlagData === undefined || playerFlagData === {} || playerFlagData === null) {
        await game.users.current.setFlag(Constants.MODULE_ID, Constants.playerFlag, jsonData);
        return;
    }
    // This supports "updating" the default presets
    // Only done if the version in the player flag is out of date
    if (playerFlagData["version"] !== jsonData["version"]) {
        // Iterate through each type of shop (potion, magic item, etc)
        for (const shopType of Object.keys(jsonData.presets)) {
            if (playerFlagData.presets[shopType] === undefined) {
                playerFlagData.presets[shopType] = {};
            }
            // Iterate through each of the default presets and update
            for (const preset of Object.keys(jsonData.presets[shopType])) {
                playerFlagData.presets[shopType][preset] = jsonData.presets[shopType][preset];
            }
        }
        playerFlagData["version"] = jsonData["version"];
        game.users.current.setFlag(Constants.MODULE_ID, Constants.playerFlag, playerFlagData);
    }
}