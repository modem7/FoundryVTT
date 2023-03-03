import {Constants, RuntimeValues} from "./values.js";
import {getPreset, getValidPresetsOfType, getPresetByName, setPlayerPresets} from "./utils/presets.js";
import {generateValidPresetObjectFromForm} from "./utils/generator_utils.js";
import {generateItemShop} from "./generator.js";
import {uiLogging} from "./utils/logging.js";

export class ShopGenerator extends FormApplication {

    TYPE_REGEX = /([\S\d_]+)-type-(range|chance)/g;

    /**
     * @override
     */
    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            closeOnSubmit: true,
            height: 'auto',
            id: 'shop-gen',
            submitOnChange: false,
            template: Constants.templates.shop_generator,
            title: "Shop Generator",
            userId: game.userId,
        };
        return foundry.utils.mergeObject(defaults, overrides);
    }

    /**
     * @override
     */
    getData(options) {
        const values = {
            preset: RuntimeValues.selectedPreset,
            presetID: RuntimeValues.selectedPresetID,
            presetName: RuntimeValues.selectedPresetName,
            validShopTypes: RuntimeValues.validShopTypes,
            shopType: RuntimeValues.selectedShopType,
            validPresets: RuntimeValues.validPresets,
            spellLevels: Constants.spellLevels,
            rarities: Constants.rarities,
        };
        return values;
    }

    async _handleButtonClick(event) {
        const selectedID = $(event.currentTarget)[0].id;
        if (selectedID === "generate") { // If the generate button is clicked
            const shopSettings = generateValidPresetObjectFromForm($("#shopType").val());
            await generateItemShop(shopSettings, $("#shopType").val());
        } else if (String(selectedID).includes("-type-")) {
            const shopSettings = generateValidPresetObjectFromForm($("#shopType").val());
            const splitted = selectedID.split("-");
            if (shopSettings[splitted[0]].max === undefined && shopSettings[splitted[0]].type === "range") { // We know the type was changed to range
                shopSettings[splitted[0]].min = 1;
                shopSettings[splitted[0]].max = 1;
                shopSettings[splitted[0]].allow_duplicates = true;
            } else if (shopSettings[splitted[0]].chance === undefined && shopSettings[splitted[0]].type === "chance") { // We know the type was changed to chance
                shopSettings[splitted[0]].allow_duplicates = false;
                shopSettings[splitted[0]].chance = 0.5;
            }
            RuntimeValues.selectedPreset = shopSettings;
            this.render();
        } else if (String(selectedID) === "save") {
            const shopSettings = generateValidPresetObjectFromForm($("#shopType").val());
            let playerFlagData = game.users.current.getFlag(Constants.MODULE_ID, Constants.playerFlag);
            const existingPreset = getPresetByName(RuntimeValues.selectedShopType, $("#preset-name").val());
            if (existingPreset === null) { // If not, we can just create the new preset and add it to the player's flag
                playerFlagData["presets"][RuntimeValues.selectedShopType][$("#preset-name").val()] = shopSettings;
            } else {
                if (existingPreset.default) {
                    uiLogging(`Unable to overwrite existing preset with name ${$("#preset-name").val()}, as it is a default preset`, "warn");
                    return
                }
                playerFlagData["presets"][RuntimeValues.selectedShopType][$("#preset-name").val()] = shopSettings;
            }
            await setPlayerPresets(playerFlagData);
        }
    }

    async _handleSelect(event) {
        const selectedElement = $(event.currentTarget);
        const selectedValue = selectedElement[0].value;
        // Handling if the value that was changed is for the Shop Type
        if (selectedElement[0].id === Constants.shopGenTemplateIDs.shopType) {
            // If the user selects back to the default option, we want to not display anything else, as this could cause issues. So set other values back to defaults
            if (selectedValue === "") {
                RuntimeValues.selectedShopType = null;
                RuntimeValues.validPresets = null;
                this.render();
                return;
            }
            // If the user just changed it back it's existing value, we don't care. Do nothing.
            if (selectedValue === RuntimeValues.selectedShopType) {
                return;
            }
            // Set all values
            RuntimeValues.selectedShopType = selectedValue;
            RuntimeValues.validPresets = getValidPresetsOfType(selectedValue);
            RuntimeValues.selectedPresetID = null; // We set the selected preset values back to their defaults, in order to prevent any confusion
            RuntimeValues.selectedPreset = null;
            this.render();
        } else if (selectedElement[0].id === Constants.shopGenTemplateIDs.shopPreset) {
            // If the user selects back to the default option, we want to not display anything else, as this could cause issues. So set other values back to defaults
            if (selectedValue === "") {
                RuntimeValues.selectedPreset = null;
                RuntimeValues.selectedPresetID = null;
                RuntimeValues.selectedPresetName = null;
                this.render();
                return;
            }
            // If the user just changed it back it's existing value, we don't care. Do nothing.
            if (selectedValue === RuntimeValues.selectedPresetID) {
                return;
            }
            // Set all values
            RuntimeValues.selectedPresetID = selectedValue;
            RuntimeValues.selectedPresetName = getPreset(RuntimeValues.selectedShopType, selectedValue, false).name;
            RuntimeValues.selectedPreset = getPreset(RuntimeValues.selectedShopType, selectedValue, true);
            this.render();
        }
    }

    /**
     * @override
     */
    activateListeners(html) {
        super.activateListeners(html);
        html.on("click", "[data-action]", this._handleButtonClick.bind(this));
        html.on("change", "[data-action]", this._handleSelect.bind(this));
    }
}