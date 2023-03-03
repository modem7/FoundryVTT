import { uiLogging } from "./logging.js";
import {Constants} from "../values.js";

// A function to randomly shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/*
A simple function to get a random integer between two numbers (min included, max excluded)
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (parseInt(max) - parseInt(min))) + parseInt(min);
}

/*
A function to get a random list of items based upon an input list, and a number of items
Duplicates are allowed.
 */
export function getRandomItemsWithDuplicates(itemArray, numItems) {
    const itemsToReturn = {};
    for (let i = 0; i<numItems; i++) {
        // Get a random item, push it to the items to return array
        let randomNumber = getRandomInt(0, itemArray.length);
        if (!itemsToReturn.hasOwnProperty(itemArray[randomNumber].name)) {
            itemsToReturn[`${itemArray[randomNumber].name}`] = {price: 0, quantity: 1, value: itemArray[randomNumber]};
        } else {
            itemsToReturn[`${itemArray[randomNumber].name}`]["quantity"]++;
        }
    }
    return itemsToReturn;
}

/*
A function to get a random list of items based upon an input list, and a number of items
Duplicates are not allowed. If the numItems is larger than the number of possible items, a warning will be thrown, and the entire possible list will be returned.
 */
export function getRandomItemsWithoutDuplication(itemArray, numItems) {
    // Warn if more items are requested than exist
    if (itemArray.length < numItems) {
        uiLogging(`Length of item array is ${itemArray.length} less than the number of items requested, ${numItems}`, "warn");
    }
    // Get the random list of items, then convert to an object containing the items, each having a quantity of 1
    const itemsList = shuffleArray(itemArray);
    const itemsToReturn = {};
    for (const item of itemsList.slice(0, numItems)) {
        itemsToReturn[`${item.name}`] = {price: 0, quantity: 1, value: item}
    }
    return itemsToReturn;
}

/* 
A function to get exactly one item of a specified rarity, and allows specifying a percent chance for this rarity to have one item present in the shop (this number is specified as a decimal)
*/
export function getRandomItemWithChance(itemArray, chance) {
    const itemsToReturn = {};
    // Get a randum number, and if below the number of chance, return empty object
    const randomNumber = Math.random();
    if (chance < randomNumber) {
        return itemsToReturn;
    }
    // Get the random element, and return it
    const randomElement = getRandomInt(0, itemArray.length);
    itemsToReturn[`${itemArray[randomElement].name}`] = {price: 0, quantity: 1, value: itemArray[randomElement]};
    return itemsToReturn;
}

export function generateValidPresetObjectFromForm(shopType) {
    let preset = {};
    let iterator = null;
    if (shopType == "spell") {
        iterator = Object.keys(Constants.spellLevels);
    } else {
        iterator = Object.keys(Constants.rarities);
    }
    preset["name"] = $("#preset-name").val();
    for (const level of iterator) {
        const isChance = $(`#${level}-type-chance`).is(":checked");
        preset[level] = {}
        if (isChance) {
            preset[level]["type"] = "chance";
            preset[level]["allow_duplicates"] = false;
            preset[level]["chance"] = $(`#${level}-chance`).val(); /* TODO: More validations for the values here */
        } else {
            preset[level]["type"] = "range";
            preset[level]["allow_duplicates"] = $(`#${level}-range-allow-duplicates`).is(":checked");
            preset[level]["min"] = $(`#${level}-range-min`).val();
            preset[level]["max"] = $(`#${level}-range-max`).val();
        }
    }
    return preset;
}