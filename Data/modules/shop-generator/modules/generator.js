import {Constants} from "./values.js";
import {mapCompendiumContentsToRarity} from "./compendium.js";
import {getRandomInt, getRandomItemsWithDuplicates, getRandomItemsWithoutDuplication, getRandomItemWithChance} from "./utils/generator_utils.js";
import { getRarities } from "./utils/compendium_utils.js";
import { getObjectPrice } from "./utils/pricing.js";

export async function generateItemShop(shopSettings, type) {
    // Initialize the chat message
    let chatMessage = "<h1>Shop Contents</h1>";
    // Get the compendium's contents as a map of rarities to arrays of items
    const compendiumName = game.settings.get(Constants.MODULE_ID, Constants["settings"][`${type}_compendium`]);
    const compendiumContents = await mapCompendiumContentsToRarity(compendiumName, type);
    //Get the list of possible rarities
    const rarities = getRarities(type);
    // Iterate through each possible rarity
    for (const rarity of Object.keys(rarities)) {
        const raritySettings = shopSettings[`${rarity}`];
        let items = [];
        if (raritySettings.type === "range" && raritySettings.allow_duplicates) {
            items = getRandomItemsWithDuplicates(compendiumContents.get(`${rarity}`), getRandomInt(raritySettings.min, raritySettings.max++));
        } else if (raritySettings.type === "range" && !raritySettings.allow_duplicates) {
            items = getRandomItemsWithoutDuplication(compendiumContents.get(`${rarity}`), getRandomInt(raritySettings.min, raritySettings.max++));
        } else if (raritySettings.type === "chance") {
            items = getRandomItemWithChance(compendiumContents.get(`${rarity}`), raritySettings.chance);
        }
        // If no items were returned, we don't want to mention that rarity in the chat message
        if (Object.keys(items).length > 0) {
            // Add the rarity as an H2 element, and then initiate the table
            chatMessage = chatMessage.concat(`<h2>${rarities[rarity]}:</h2><br/><table><tr><td>Item</td><td>Quantity</td><td>Price</td></tr>`);
            // Iterate through each item, then add them to the table
            for (const item of Object.keys(items)) {
                chatMessage = chatMessage.concat(`<tr><td>${items[item].value.name}</td><td>${items[item].quantity}</td><td>${getObjectPrice(items[item].value, type)}</td></tr>`);
            }
            chatMessage = chatMessage.concat(`</table>`);
        }
    }
    ChatMessage.create({
        content: chatMessage
    });
}