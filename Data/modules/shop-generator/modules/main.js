import {registerSettings, checkSettingsDefined, setValidShopTypes} from "./settings.js";
import {setDefaultPresets} from "./utils/player_config.js";
import {initializePricingOverride} from "./utils/pricing.js";
import {ShopGenerator} from "./forms.js";
import {uiLogging} from "./utils/logging.js";


Hooks.on("ready", async function () {
    registerSettings();
    setValidShopTypes();
    await setDefaultPresets();
    initializePricingOverride();
    const items = await game.packs.get("world.spells").getDocuments();
});

Hooks.on("renderItemDirectory", (itemDirectory, html) => {
    const itemHeaders = html.find(`[class="directory-header"]`)
    const tooltip = game.i18n.localize("SHOP-GEN.UI.items-button")
    itemHeaders.append(`<button type='button' class='shop-generator-icon-button flex0' title='${tooltip}'><i class='fa-solid fa-shield'> Shop Generator</button>`);
    html.on("click", ".shop-generator-icon-button", (event) => {
        if (checkSettingsDefined()) {
            const shopgen = new ShopGenerator();
            shopgen.render(true, {width: (window.innerWidth/3)});
        } else {
            uiLogging("Please configure settings for module before using shop gen", "error")
        }

    });
});
