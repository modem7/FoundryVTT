import { ItemSheet5eWithBags } from "./ItemSheet5eWithBags.js";
import { ItemSheetShop } from "./ItemSheetShop.js";
import { displayDescription } from "./settings.js";
export function getActor() {
    if (this.parent instanceof Item)
        return null;
    return this.parent;
}
export async function createEmbeddedDocuments(wrapped, embeddedName, data, context) {
    if (this.type !== "backpack" || embeddedName !== "Item")
        return wrapped(embeddedName, data, context);
    if (!Array.isArray(data))
        data = [data];
    let currentItems = duplicate(getProperty(this, "flags.itemcollection.contentsData") ?? []);
    currentItems = currentItems.map(itemData => {
        if (itemData.data) {
            itemData.system = itemData.data;
            delete itemData.data;
        }
        ;
        return itemData;
    });
    if (data.length) {
        for (const itemData of data) {
            let theData = itemData;
            theData._id = randomID();
            // const theItem = new CONFIG.Item.documentClass(theData, {parent: this}).toJSON();
            currentItems.push(theData);
        }
        if (this.parent)
            return await this.parent.updateEmbeddedDocuments("Item", [{ "_id": this.id, "flags.itemcollection.contentsData": currentItems }]);
        else
            return setCollection(this, currentItems);
    }
}
export function isEmbedded() {
    // for items with an item parent we need to relax the definition a bit.
    // TODO find out how to do this with proper wrapping
    if (!(this.parent instanceof Item))
        return (this.parent !== null) && (this.documentName in this.parent.constructor.metadata.embedded);
    return (this.parent !== null);
}
export async function createDocuments(wrapped, data = [], context = { parent: {}, pack: {}, options: {} }) {
    const { parent, pack, options } = context;
    if (!(this.type === "backpack" && parent instanceof Item))
        return wrapped(data, context);
    await parent.createEmbeddedDocuments("Item", data, options);
}
export function getEmbeddedDocument(wrapped, embeddedName, id, { strict = false } = {}) {
    if (this.type !== "backpack")
        return wrapped(embeddedName, id, { strict });
    return this.items.get(id);
}
export async function updateEmbeddedDocuments(wrapped, embeddedName, data, options) {
    if (this.type !== "backpack" || embeddedName !== "Item")
        return wrapped(embeddedName, data, options);
    const contained = getProperty(this, "flags.itemcollection.contentsData") ?? [];
    if (!Array.isArray(data))
        data = [data];
    const updated = [];
    const newContained = contained.map(existing => {
        if (!existing.system && existing.data) {
            existing.system = existing.data;
            delete existing.data;
        }
        const theUpdate = data.find(update => update._id === existing._id);
        if (theUpdate) {
            const newData = mergeObject(existing, theUpdate, { overwrite: true, insertKeys: true, insertValues: true, inplace: false });
            updated.push(newData);
            return newData;
        }
        return existing;
    });
    if (updated.length > 0) {
        if (this.parent) {
            await setCollection(this, newContained);
            delete this.flags.itemcollection.contents;
            await this.parent.updateEmbeddedDocuments("Item", [{ "_id": this.id, "flags.itemcollection.contentsData": newContained }]);
        }
        else {
            await setCollection(this, newContained);
        }
    }
    return updated;
}
export async function updateDocuments(wrapped, updates = [], context = { parent: {}, pack: {}, options: {} }) {
    const { parent, pack, options } = context;
    // An item whose parent is an item only exists in the parents embedded documents
    if (!(parent instanceof Item && parent.type !== "backpack"))
        return wrapped(updates, context);
    return parent.updateEmbeddedDocuments("Item", updates, options);
}
async function setCollection(item, contents) {
    // item.update({"flags.itemcollection.contentsData": contents);
    const rv = await item.setFlag("itemcollection", "contentsData", duplicate(contents));
    return rv;
}
export async function deleteEmbeddedDocuments(wrapped, embeddedName, ids = [], options = {}) {
    if (this.type !== "backpack" || embeddedName !== "Item")
        return wrapped(embeddedName, ids, options);
    const containedItems = getProperty(this, "flags.itemcollection.contentsData") ?? [];
    const newContained = containedItems.filter((itemData) => !ids.includes(itemData._id));
    const deletedItems = this.items.filter((item) => ids.includes(item.id));
    if (this.parent) {
        // await setCollection(this, newContained);
        await this.parent.updateEmbeddedDocuments("Item", [
            { "_id": this.id, "flags.itemcollection.contentsData": newContained }
        ]);
    }
    else {
        await setCollection(this, newContained);
    }
    return deletedItems;
}
export async function deleteDocuments(wrapped, ids = [], context = { parent: {}, pack: {}, options: {} }) {
    const { parent, pack, options } = context;
    if (!(parent instanceof Item && parent.type === "backpack"))
        return wrapped(ids, context);
    // an Item whose parent is an item only exists in the embedded documents
    return parent.deleteEmbeddedDocuments("Item", ids);
}
export function getEmbeddedCollection(wrapped, type) {
    if (type === "Item" && this.type === "backpack")
        return this.items;
    return wrapped(type);
}
export function prepareDerivedData(wrapped) {
    wrapped();
    if (!(this instanceof Item && this.type === "backpack" && this.flags.itemcollection))
        return;
    if (!(this.sheet instanceof ItemSheet5eWithBags || this.sheet instanceof ItemSheetShop))
        return;
    this.system.weight = this.calcWeight();
    this._source.system.weight = this.calcWeight();
    //@ts-expect-error
    if (game.system.id === "dnd5e" && isNewerVersion(game.system.version, "2.0.3")) {
        if ((typeof this.system.price) !== "object") {
            console.error("unexpected price value ", this, this.system.price);
            this.system.price = {};
        }
        this.system.price.value = this.calcPrice();
        this.system.price.denomination = "gp";
        this._source.system.price.value = this.calcPrice();
        this._source.system.price.denomination = "gp";
    }
    else {
        this.system.price = this.calcPrice();
        this._source.system.price = this.calcPrice();
    }
    if (!this.system.details)
        setProperty(this.system, "details", {});
}
export function prepareEmbeddedEntities(wrapped) {
    wrapped();
    if (!(this instanceof Item && this.type === "backpack"))
        return;
    const containedItems = (getProperty(this, "flags.itemcollection.contentsData") ?? []).map(itemData => {
        if (!itemData.system && itemData.data) {
            itemData.system = itemData.data;
            delete itemData.data;
        }
        ;
        return itemData;
    });
    const oldItems = this.items;
    this.items = new foundry.utils.Collection();
    containedItems.forEach(idata => {
        if (!(oldItems?.has(idata._id))) {
            let theItem;
            try {
                theItem = new CONFIG.Item.documentClass(idata, { parent: this });
                this.items.set(idata._id, theItem);
            }
            catch (err) {
                console.error("itemcollection | Create item error", idata, theItem, err);
            }
        }
        else { // TODO see how to avoid this - here to make sure the contained items is correctly setup
            const currentItem = oldItems.get(idata._id);
            currentItem.flags = mergeObject(currentItem.flags ?? {}, idata.flags);
            currentItem.system = mergeObject(currentItem.system ?? {}, idata.system);
            currentItem.updateSource(duplicate(idata));
            // setProperty(currentItem, "_source", idata);
            currentItem.name = idata.name;
            currentItem.img = idata.img;
            currentItem.prepareData();
            this.items.set(idata._id, currentItem);
            if (this.sheet?.rendered) {
                this.system.weight = this.calcWeight();
                this.sheet.render(false, { action: "update", data: currentItem.toObject(false) });
            }
            if (currentItem.sheet?.rendered) {
                currentItem.sheet.render(false, { action: "update", data: currentItem.toObject(false) });
                // currentItem.sheet.render(false, {action: "update"});
            }
        }
    });
}
export async function _update(wrapped, data, context) {
    if (!(this.parent instanceof Item))
        return wrapped(data, context);
    data = foundry.utils.expandObject(data);
    data._id = this.id;
    await this.parent.updateEmbeddedDocuments("Item", [data]);
    this.render(false, { action: "update", data: data });
}
export async function _delete(wrapped, data) {
    if (!(this.parent instanceof Item))
        return wrapped(data);
    return this.parent.deleteEmbeddedDocuments("Item", [this.id]);
}
export async function _onCreateDocuments(wrapped, items, context) {
    if (!(context.parent instanceof Item))
        return wrapped(items, context);
    if (items.filter(item => item.type === "backpack").length === 0)
        return wrapped(items, context);
    // if (!(context.parent instanceof Item && this.type === "backpack")) return wrapped(items, context);
    const toCreate = [];
    for (const item of items) {
        for (const e of item.effects) {
            if (!e.transfer)
                continue;
            const effectData = e.toObject();
            effectData.origin = item.uuid;
            toCreate.push(effectData);
        }
    }
    if (!toCreate.length)
        return [];
    const cls = getDocumentClass("ActiveEffect");
    return cls.createDocuments(toCreate, context);
}
export function calcWeight({ ignoreItems, ignoreTypes } = { ignoreItems: undefined, ignoreTypes: undefined }) {
    if (this.type !== "backpack" || !this.flags.itemcollection)
        return this.calcItemWeight();
    if (this.parent instanceof Actor && (!this.system.equipped && this.flags.itemcollection.weightlessUnequipped))
        return 0;
    const weightless = getProperty(this, "system.capacity.weightless") ?? false;
    if (weightless)
        return getProperty(this, "flags.itemcollection.bagWeight") ?? 0;
    return this.calcItemWeight({ ignoreItems, ignoreTypes }) + ((getProperty(this, "flags.itemcollection.bagWeight") || 0));
}
export function calcItemWeight({ ignoreItems, ignoreTypes } = { ignoreItems: [], ignoreTypes: [] }) {
    if (this.type !== "backpack" || this.items === undefined)
        return _calcItemWeight(this);
    const weight = this.items.reduce((acc, item) => {
        if (ignoreTypes?.some(name => item.name.includes(name)))
            return acc;
        //@ts-expect-error
        if (ignoreItems?.includes(item.name))
            return acc;
        return acc + (item.calcWeight() || 0);
    }, (this.type === "backpack" ? 0 : (_calcItemWeight(this)) || 0));
    if (!game.settings.get("dnd5e", "currencyWeight"))
        return Math.round(weight);
    const currency = this.system.currency ?? {};
    const numCoins = currency ? Object.keys(currency).reduce((val, denom) => val + currency[denom], 0) : 0;
    return Math.round(weight + numCoins / 50);
}
export function containedItemCount() {
    if (this.type !== "backpack")
        return (this.system.quantity ?? 1);
    return this.items.reduce((acc, item) => acc + item.containedItemCount(), 0);
}
export function _calcItemPrice(item) {
    if (item.type === "backpack")
        return item.flags.itemcollection?.bagPrice ?? 0;
    const quantity = item.system.quantity || 1;
    let price = item.system.price ?? 0;
    if (item.system.price?.denomination) {
        const denomValue = {
            "pp": 10,
            "gp": 1,
            "ep": 0.5,
            "sp": 0.1,
            "cp": 0.01
        }[item.system.price.denomination] ?? 0;
        price = item.system.price.value * denomValue;
    }
    return Math.round(price * quantity * 100) / 100;
}
export function _calcItemWeight(item) {
    const quantity = item.system.quantity || 1;
    const weight = item.system.weight || 0;
    return Math.round(weight * quantity * 100) / 100;
}
export function calcPrice() {
    if (this.type !== "backpack" || this.items === undefined)
        return _calcItemPrice(this);
    const currency = this.system.currency ?? {};
    const coinValue = currency ? Object.keys(currency)
        .reduce((val, denom) => val += {
        "pp": 10,
        "gp": 1,
        "ep": 0.5,
        "sp": 0.1,
        "cp": 0.01
    }[denom] * currency[denom], 0) : 0;
    const price = this.items.reduce((acc, item) => acc + (item.calcPrice() ?? 0), _calcItemPrice(this) || 0);
    return Math.round((price + coinValue) * 100) / 100;
}
export async function getChatData(wrapped, ...args) {
    const chatData = await wrapped(...args);
    if (displayDescription || this.type !== "backpack" || this.items === undefined)
        return chatData;
    chatData.description.value = "<table>";
    for (const item of this.items) {
        let itemString = "";
        if (item.type === "backpack" && item.items !== undefined)
            itemString = `<tr><td>${item.name}</td><td>${(await item.getChatData()).description.value}</td></tr>`;
        else
            itemString = `<tr><td>${item.name}</td><td>${item.system.quantity ?? ""}</td><td>${item.system.weight ?? ""}</td></tr>`;
        chatData.description.value += itemString;
    }
    chatData.description.value += "</table>";
    return chatData;
}
