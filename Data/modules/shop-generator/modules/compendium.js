import {getFreshMapByRarity} from "./utils/compendium_utils.js";
import {consoleLogging, uiLogging} from "./utils/logging.js";

export async function mapCompendiumContentsToRarity(compendiumName, shopType) {
    const itemMap = getFreshMapByRarity(shopType);
    const compendium = game.packs.get(compendiumName);
    let items = await compendium.getDocuments();
    let rarityOrLevel = "rarity";
    let hasWarnings = false;
    if (shopType == "spell") {
        rarityOrLevel = "level";
    }
    for (const item of items) {
        // Check the rarity is not an empty string
        if (!item.system[rarityOrLevel].toString().toLowerCase()) {
            consoleLogging(`${item.name} does not have a ${rarityOrLevel}`, "warn");
            hasWarnings = true;
            continue
        }
        const rarity = item.system[rarityOrLevel].toString().toLowerCase();
        if (rarity === "artifact") {
            consoleLogging(`${item.name} is an artifact, skipping`, "warn");
            hasWarnings = true;
            continue
        }
        // We've gotta convert to string here just to prevent issues with the fact that spell levels are an integer
        itemMap.get(item.system[rarityOrLevel].toString().toLowerCase()).push(item);
    }
    if (hasWarnings) {
        uiLogging("See console for warnings", "warn")
    }
    return itemMap;
}