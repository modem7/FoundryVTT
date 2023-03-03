import { warn } from "./libs/lib.js";
import { getEmbeddedDocument, createEmbeddedDocuments, deleteEmbeddedDocuments, updateEmbeddedDocuments, prepareEmbeddedEntities, getEmbeddedCollection, _onCreateDocuments, calcPrice, calcWeight, containedItemCount, deleteDocuments, getActor, updateDocuments, calcItemWeight, _update, _delete, prepareDerivedData, isEmbedded, getChatData } from "./ItemContainer.js";
import CONSTANTS from "./constants.js";
import { ItemSheet5eWithBags } from "./ItemSheet5eWithBags.js";
export const readyHooks = async () => {
    warn("Ready Hooks processing");
};
export const initHooks = () => {
    warn("Init Hooks processing");
    // setup all the hooks
};
export const setupHooks = () => {
    warn("Setup Hooks processing");
    // TODO we cna remove this ????
    //@ts-expect-error
    libWrapper.ignore_conflicts(CONSTANTS.MODULE_NAME, "VariantEncumbrance", "CONFIG.Item.documentClass.prototype.updateEmbeddedDocuments");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.getEmbeddedDocument", getEmbeddedDocument, "MIXED");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.createEmbeddedDocuments", createEmbeddedDocuments, "MIXED");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.deleteEmbeddedDocuments", deleteEmbeddedDocuments, "MIXED");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.updateEmbeddedDocuments", updateEmbeddedDocuments, "MIXED");
    if (isNewerVersion(game.version, "0.9.0")) {
        //@ts-expect-error
        libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.prepareEmbeddedDocuments", prepareEmbeddedEntities, "WRAPPER");
    }
    else {
        //@ts-expect-error
        libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.prepareEmbeddedEntities", prepareEmbeddedEntities, "WRAPPER");
    }
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.getEmbeddedCollection", getEmbeddedCollection, "MIXED");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.prepareDerivedData", prepareDerivedData, "WRAPPER");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.actor", getActor, "OVERRIDE");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.update", _update, "MIXED");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.delete", _delete, "MIXED");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.isEmbedded", isEmbedded, "OVERRIDE");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass._onCreateDocuments", _onCreateDocuments, "MIXED");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.deleteDocuments", deleteDocuments, "MIXED");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.updateDocuments", updateDocuments, "MIXED");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Item.documentClass.prototype.getChatData", getChatData, "WRAPPER");
    //@ts-expect-error
    libWrapper.register(CONSTANTS.MODULE_NAME, "ActorSheet.prototype._onDropItem", testOnDrop, "WRAPPER");
    async function testOnDrop(wrapped, event, data) {
        const returnValue = await wrapped(event, data);
        if (data.uuid && returnValue) {
            const item = await fromUuid(data.uuid);
            if (item?.parent instanceof Item)
                await item.delete();
        }
        return returnValue;
    }
    //@ts-expect-error documentClass
    CONFIG.Item.documentClass.prototype.calcWeight = calcWeight;
    //@ts-expect-error documentClass
    CONFIG.Item.documentClass.prototype.calcItemWeight = calcItemWeight;
    //@ts-expect-error documentClass
    CONFIG.Item.documentClass.prototype.calcPrice = calcPrice;
    //@ts-expect-error documentClass
    CONFIG.Item.documentClass.prototype.containedItemCount = containedItemCount;
    Hooks.on("preCreateItem", (candidate, data, options, user) => {
        if (!(candidate instanceof Item
            && candidate.type === "backpack"
            && data.flags?.itemcollection
            && candidate.getFlag(CONSTANTS.MODULE_NAME, 'version') !== "0.8.6"))
            return true;
        if (data.flags.itemcollection?.contents && data.flags.itemcollection?.version !== "0.8.6") { // old version to convert
            const itemcollectionData = {
                contentsData: duplicate(data.flags.itemcollection.contents || []),
                version: "0.8.6",
                bagWeight: data.flags.itemcollection?.fixedWeight ?? 0,
                bagPrice: data.system.price ?? 0
            };
            itemcollectionData.contentsData.forEach(itemData => {
                itemData._id = randomID();
                (itemData.effects ?? []).forEach(effectData => {
                    effectData.origin = undefined;
                });
                if (itemData.type === "backpack")
                    fixupItemData(itemData);
            });
            //@ts-expect-error updateSource
            candidate.updateSource({
                "flags.itemcollection.-=contents": null,
                "flags.itemcollection.-=goldValue": null,
                "flags.itemcollection.-=fixedWeight": null,
                "flags.itemcollection.-=importSpells": null,
                "flags.itemcollection.-=itemWeight": null
            });
            //@ts-expect-error updateSource
            candidate.updateSource({ "flags.itemcollection": itemcollectionData });
        }
    });
    Hooks.on("updateItem", (item, updates, options, user) => {
    });
    //@ts-expect-error registerheet sheetclass
    Items.registerSheet("dnd5e", ItemSheet5eWithBags, {
        makeDefault: true,
        types: ["backpack"],
        label: "ItemSheet5eWithBags"
    });
};
export function fixupItemData(itemData) {
    if (!itemData.flags.itemcollection || itemData.flags.itemcollection.version === "0.8.6")
        return;
    const itemcontents = duplicate(itemData.flags.itemcollection.contents || []);
    for (const iidata of itemcontents) {
        iidata._id = randomID();
        (iidata.effects ?? []).forEach(effectData => {
            effectData.origin = undefined;
        });
        if (iidata.type === "backpack")
            fixupItemData(iidata);
    }
    itemData.flags.itemcollection.version = "0.8.6";
    itemData.flags.itemcollection.bagWeight = itemData.flags.itemcollection?.fixedWeight ?? 0;
    itemData.flags.itemcollection.bagPrice = itemData.data.price ?? 0;
    itemData.flags.itemcollection.contentsData = itemcontents;
    delete itemData.flags.itemcollection.contents;
    delete itemData.flags.itemcollection.goldValue;
    delete itemData.flags.itemcollection.fixedWeight;
    delete itemData.flags.itemcollection.importSpells;
    delete itemData.flags.itemcollection.itemWeight;
}
