import CONSTANTS from "./constants.js";
import { i18n } from "./libs/lib.js";
export let displayDescription;
export function fetchParams() {
    displayDescription = game.settings.get(CONSTANTS.MODULE_NAME, "displayDescription") ?? true;
}
export const registerSettings = function () {
    setup(ItemCollectionTemplate);
};
const ItemCollectionTemplate = (function () {
    const config = {
        /**
         * The Module name
         */
        name: CONSTANTS.MODULE_NAME,
        /**
         * The module title
         */
        title: "Item Collection Settings",
        /**
         * Some generic path references that might be useful later in the application's windows
         */
        path: {
            root: `/modules/${CONSTANTS.MODULE_NAME}/`,
            itemSideBarTemplate: `/modules/${CONSTANTS.MODULE_NAME}/templates/bag-sheet.html`,
            itemDetailsTemplate: `/modules/${CONSTANTS.MODULE_NAME}/templates/shop-sheet.html`,
        },
        settings: [
            {
                name: "displayDescription",
                scope: "world",
                default: true,
                type: Boolean,
                onChange: fetchParams
            },
            {
                name: "showCurrency",
                scope: "world",
                default: true,
                type: Boolean
            },
            {
                name: "goldConversion",
                scope: "world",
                default: true,
                type: Boolean
            }, {
                name: "goldConversionPercentage",
                scope: "world",
                default: 50,
                type: Number
            }, {
                name: "sortBagContents",
                scope: "module",
                default: true,
                type: Boolean
            }
        ]
    };
    return {
        path: () => {
            return config.path;
        },
        settings: function () {
            return config.settings;
        },
        name: () => {
            return config.name;
        },
        title: () => {
            return config.title;
        }
    };
})();
function setup(templateSettings) {
    templateSettings.settings().forEach(setting => {
        const options = {
            name: i18n(`${templateSettings.name()}.${setting.name}.Name`),
            hint: i18n(`${templateSettings.name()}.${setting.name}.Hint`),
            scope: setting.scope,
            config: true,
            default: setting.default,
            type: setting.type,
        };
        if (setting.choices) {
            options.choices = setting.choices;
        }
        if (setting.onChange)
            options.onChange = setting.onChange;
        game.settings.register(templateSettings.name(), setting.name, options);
    });
    fetchParams();
}
