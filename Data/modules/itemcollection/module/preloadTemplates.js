import CONSTANTS from "./constants.js";
export const preloadTemplates = async function () {
    // const CONSTANTS.MODULE_NAME = 'itemcollection';
    const templatePaths = [
        // Add paths to "module/XXX/templates"
        `modules/${CONSTANTS.MODULE_NAME}/templates/bag-sheet.html`,
        `modules/${CONSTANTS.MODULE_NAME}/templates/bag-description.html`,
        `modules/${CONSTANTS.MODULE_NAME}/templates/shop-sheet.html`
    ];
    return loadTemplates(templatePaths);
};
