import CONSTANTS from "./constants.js";
import { error, info, log, warn } from "./libs/lib.js";
// let knownSheets = {};
// let templates = {};
let canAlwaysAddToBag;
let canAlwaysAddToBagTypes;
Hooks.once("ready", () => {
    if (game.i18n.localize(CONSTANTS.MODULE_NAME + ".canAlwaysAddToBagv9") !== CONSTANTS.MODULE_NAME + ".canAlwaysAddToBagv9") {
        canAlwaysAddToBag = game.i18n.localize(CONSTANTS.MODULE_NAME + ".canAlwaysAddToBagv9").split(",").map(s => s.trim());
        canAlwaysAddToBagTypes = game.i18n.localize(CONSTANTS.MODULE_NAME + ".canAlwaysAddToBagTypesv9").split("'").map(s => s.trim());
    }
    else {
        canAlwaysAddToBag = game.i18n.localize(CONSTANTS.MODULE_NAME + ".canAlwaysAddToBag");
        canAlwaysAddToBagTypes = game.i18n.localize(CONSTANTS.MODULE_NAME + ".canAlwaysAddToBagTypes");
    }
});
export class ItemSheet5eWithBags extends globalThis.dnd5e.applications.item.ItemSheet5e {
    constructor(...args) {
        super(...args);
        this.blankCurrency = { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 };
        this.filter = "";
        this.options.width = 570;
        this.options.height = 500;
        // this.item = args[0];
    }
    /** @override */
    static get defaultOptions() {
        const options = super.defaultOptions;
        mergeObject(options, {
            width: 570,
            height: 500,
            //@ts-ignore 
            showUnpreparedSpells: true,
            tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "details" }]
        });
        return options;
    }
    /** @override */
    get template() {
        return `/modules/${CONSTANTS.MODULE_NAME}/templates/bag-sheet.html`;
    }
    //@ts-ignore
    render(...args) {
        super.render(...args);
    }
    //@ts-ignore
    async _onSubmit(event, { updateData = null, preventClose = false } = {}) {
        super._onSubmit(event, { updateData, preventClose });
    }
    /** @override */
    async getData(options) {
        const type = this.item.type;
        if (!["backpack"].includes(type)) {
            error(game.i18n.localize(CONSTANTS.MODULE_NAME + ".wrongType"), true);
            this.options.editable = false;
            options.editable = false;
            return super.getData(options);
        }
        ;
        let context;
        try {
            const item = this.item;
            context = await super.getData(options);
            context.flags = duplicate(item.flags);
            // setProperty(context.flags.itemcollection, "contentsData", await this.item.getFlag("itemcollection", "contentsData"));
            context.showCurrency = this.item.system.currency && game.settings.get(CONSTANTS.MODULE_NAME, "showCurrency");
            //@ts-ignore
            context.currencies = Object.entries(CONFIG.DND5E.currencies).reduce((obj, [k, c]) => {
                //@ts-ignore
                obj[k] = c.label;
                return obj;
            }, {});
            if (!hasProperty(context.flags, CONSTANTS.MODULE_NAME + ".bagWeight"))
                setProperty(context.flags, CONSTANTS.MODULE_NAME + ".bagWeight", 0);
            if (!hasProperty(context.flags, CONSTANTS.MODULE_NAME + ".goldValue"))
                setProperty(context.flags, CONSTANTS.MODULE_NAME + ".goldValue", 0);
            if (!hasProperty(context.flags, CONSTANTS.MODULE_NAME + ".contentsData"))
                setProperty(context.flags, CONSTANTS.MODULE_NAME + ".contentsData", []);
            if (!hasProperty(context.flags, CONSTANTS.MODULE_NAME + ".importSpells"))
                setProperty(context.flags, CONSTANTS.MODULE_NAME + ".importSpells", false);
            //this.baseapps.options.editable = this.baseapps.options.editable// && (!this.item.actor || !this.item.actor.token);
            context.hasDetails = true;
            if (game.settings.get(CONSTANTS.MODULE_NAME, "sortBagContents")) {
                context.flags.itemcollection.contentsData.sort((a, b) => {
                    if (a.type === "spell" && b.type !== "spell")
                        return 1;
                    if (a.type !== "spell" && b.type === "spell")
                        return -1;
                    // if (a.type !== b.type) return (a.type < b.type ? -1 : 1);
                    if (a.type !== "spell")
                        return (a.name < b.name ? -1 : 1);
                    if (a.level !== b.level)
                        return (a.level - b.level);
                    return a.name < b.name ? -1 : 1;
                });
            }
            context.isGM = game.user?.isGM;
            //TODO check this out
            for (const i of context.flags.itemcollection.contentsData) {
                i.isBackpack = i.type === "backpack";
                i.isSpell = i.type === "spell";
                i.totalWeight = i.system.weight * i.system.quantity;
            }
            context.canImportExport = item.parent !== undefined;
            context.isOwned = item.parent !== undefined;
            context.canConvertToGold = game.settings.get(CONSTANTS.MODULE_NAME, 'goldConversion');
            context.totalGoldValue = this.item.calcPrice();
            context.itemsWeight = this.item.calcItemWeight();
            context.weight = this.item.calcWeight();
            let parent = this.item.parent;
            context.isGM = game.user?.isGM;
            context.parentName = "";
            while (parent) {
                context.parentName += `<- ${parent.name} `;
                parent = parent.parent;
            }
            if (context.parentName.length > 0)
                context.parentName = `(${context.parentName})`;
            context.weightUnit = game.settings.get("dnd5e", "metricWeightUnits")
                ? game.i18n.localize("DND5E.AbbreviationKgs")
                : game.i18n.localize("DND5E.AbbreviationLbs");
            context.filter = this.filter === "" ? undefined : this.filter;
            context.items = context.flags.itemcollection.contentsData; // this.filterItems(context.flags.itemcollection.contentsData)
        }
        catch (err) {
            console.warn("midi-qol | ItemSheet5eWithBags error when getting item data", err);
        }
        finally {
            return context;
        }
    }
    filterItems(itemList) {
        if (!this.filter)
            return itemList;
        const filter = this.filter.toLocaleLowerCase();
        return itemList.filter(item => item.name.toLocaleLowerCase().includes(this.filter));
    }
    _getItemAdvancement(item) {
        return {};
    }
    ;
    async _onDragItemStart(event) {
        event.stopPropagation();
        const items = this.item.getFlag(CONSTANTS.MODULE_NAME, "contentsData");
        const itemId = event.currentTarget.dataset.itemId;
        const item = this.item.items.get(itemId);
        event.dataTransfer.setData("text/plain", JSON.stringify({
            type: "Item",
            // data: item,
            uuid: item.uuid
        }));
        // await this.item.deleteEmbeddedDocuments("Item", [itemId]); - handle deletion when item is dragged to actor
        //this.render(false);
    }
    canAdd(itemData) {
        // Check that the item is not too heavy for the bag.
        const bagCapacity = this.item.system.capacity.value;
        if (bagCapacity === 0)
            return true;
        if (canAlwaysAddToBagTypes.some(name => itemData.name.includes(name)))
            return true;
        if (canAlwaysAddToBag.includes(itemData.name))
            return true;
        const itemQuantity = itemData.system.quantity || 1;
        if (this.item.system.capacity.type === "items") {
            const itemCount = this.item.containedItemCount();
            return itemCount + itemQuantity <= bagCapacity;
        }
        const newWeight = this.item.calcItemWeight({ ignoreItems: canAlwaysAddToBag, ignoreTypes: canAlwaysAddToBagTypes }) + (itemData.system.weight ?? 0) * itemQuantity;
        return bagCapacity >= newWeight;
    }
    async _onDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        let data;
        try {
            data = JSON.parse(event.dataTransfer.getData('text/plain'));
            if (data.type !== "Item") {
                log(`Bags only accept items`);
                return false;
            }
        }
        catch (err) {
            log(`drop error`);
            log(event.dataTransfer.getData('text/plain'));
            log(err);
            return false;
        }
        let theItem;
        if (data.uuid)
            theItem = await fromUuid(data.uuid);
        else if (data.data)
            theItem = new CONFIG.Item.documentClass(data.data);
        else
            return;
        if (!(theItem instanceof Item))
            return false;
        // Case 1 - Data explicitly provided
        let sourceActorOrItem = theItem.parent;
        // Check up the chain that we are not dropping one of our parents onto us.
        let canAdd = this.item.uuid !== theItem.uuid;
        ;
        let parent = this.item.parent;
        let count = 0;
        while (parent && count < 10) { // Don't allow drops of anything in the parent chain or the item will disappear.
            count += 1;
            //@ts-ignore parent.id
            canAdd = canAdd && (parent.uuid !== theItem.uuid);
            ;
            parent = parent.parent;
        }
        if (!canAdd) {
            log(`Cant drop on yourself`);
            info(game.i18n.localize('itemcollection.ExtradimensionalVortex'), true);
            throw error("Dragging bag onto istelf or ancestor opens a planar vortex and you are sucked into it");
        }
        if (this.canAdd(theItem.toObject(false))) {
            // will fit in the bag so add it to the bag and delete from the owning actor if there is one.
            await this.item.createEmbeddedDocuments("Item", [theItem.toObject(false)]);
            if (data.uuid) {
                const source = await fromUuid(data.uuid);
                //@ts-ignore deleteEmbeddedDocuments
                if (source.parent && (source.parent instanceof Actor || source.parent instanceof Item))
                    await source?.delete();
            }
            return false;
        }
        // Item will not fit in the bag what to do?
        else if (this.item.parent && this.item.parent instanceof Actor) { // this bag is owned by an actor - drop into the inventory instead.
            //@ts-ignore
            if (theItem.parent && theItem.parent instanceof Actor)
                await theItem.parent.deleteEmbeddedDocuments("Item", [theItem.id]);
            await this.item.parent.createEmbeddedDocuments("Item", [theItem.toObject(false)]);
            info(game.i18n.localize('itemcollection.AlternateDropInInventory'), true);
            return false;
        }
        // Last resort accept the drop anyway so that the item wont disappear.
        /*
        else if (data.uuid) {
          const theSourceBag = await fromUuid(data.uuid);
          theSourceBag?.createEmbeddedDocuments("Item", data.data);
          ui.notifications.warn(game.i18n.localize("itemcollection.NoRoomInBag"));
          // await this.item.createEmbeddedDocuments("Item", [theItem.toObject(false)]);
        }
        */
        else {
            ui.notifications.warn(game.i18n.localize("itemcollection.NoRoomInBag"));
            return false;
        }
    }
    async _importItemFromCollection(collection, entryId) {
        //@ts-ignore
        const item = await game.packs.get(collection).getDocument(entryId);
        if (!item)
            return;
        //@ts-ignore toJSON
        return this.item.createEmbeddedDocuments("Item", item.toObject(false));
    }
    async _itemExport(event) {
        const li = $(event.currentTarget).parents(".item");
        const id = li.attr("data-item-id");
        if (!this.item.parent)
            return;
        const item = this.item.items.get(id);
        if (!item) {
            console.error(`itemcontainers | _itemExport: Item ${id} not found in ${this.item.name}`);
            return;
        }
        Hooks.once("updateItem", () => {
            this.item.parent.createEmbeddedDocuments("Item", [item.toObject(false)]);
        });
        await this.item.deleteEmbeddedDocuments("Item", [item.id]);
        this.render();
    }
    async _itemSplit(event) {
        const li = $(event.currentTarget).parents(".item");
        const id = li.attr("data-item-id");
        const item = await this.item.getEmbeddedDocument("Item", id);
        if (item.type === "backpack") {
            warn(`can't split a bag`, true);
            return; //can't split a bag
        }
        if (item.system.quantity < 2) {
            warn(`not enough to split (quantity msut be > 1)`, true);
            return; // not enough to split
        }
        const itemData = item.toObject(false);
        const newQuantity = Math.floor(item.system.quantity / 2);
        // item.system.quantity -= newQuantity;
        itemData.system.quantity = newQuantity;
        Hooks.once("updateItem", () => this.item.createEmbeddedDocuments("Item", [itemData]));
        await item.update({ "system.quantity": item.system.quantity - newQuantity });
    }
    async _itemConvertToGold(event) {
        if (!game.settings.get(CONSTANTS.MODULE_NAME, 'goldConversion'))
            return;
        const li = $(event.currentTarget).parents(".item");
        const id = li.attr("data-item-id");
        const item = await this.item.getEmbeddedDocument("Item", id);
        if (!item) {
            return; // should not happen
        }
        const goldValue = item.calcPrice();
        if (goldValue <= 0) {
            return;
        }
        const currency = duplicate(this.item.system.currency);
        currency.gp = currency.gp + Math.round((goldValue * game.settings.get(CONSTANTS.MODULE_NAME, 'goldConversionPercentage') / 100) * 100) / 100;
        Hooks.once("updateItem", () => this.item.update({ "data.currency": currency }));
        // remove the item
        await item.delete();
        return;
    }
    // since diffObject balks on arrays need to do a deeper compare
    object_equals(x, y) {
        if (x === y) {
            return true;
        }
        // if both x and y are null or undefined and exactly the same
        if (!(x instanceof Object) || !(y instanceof Object)) {
            return false;
        }
        // if they are not strictly equal, they both need to be Objects
        if (x.type !== y.type) {
            return false;
        }
        for (const p in x) {
            if (p === "quantity") {
                continue;
            }
            // ignore quantity
            if (!Object.prototype.hasOwnProperty.call(x, p)) {
                continue;
            }
            // other properties were tested using x.constructor === y.constructor
            if (!Object.prototype.hasOwnProperty.call(y, p)) {
                return false;
            }
            // allows to compare x[ p ] and y[ p ] when set to undefined
            if (x[p] === y[p]) {
                continue;
            }
            // if they have the same strict value or identity then they are equal
            if (typeof (x[p]) !== "object") {
                return false;
            }
            // Numbers, Strings, Functions, Booleans must be strictly equal
            if (!this.object_equals(x[p], y[p])) {
                return false;
            }
            // Objects and Arrays must be tested recursively
        }
        for (const p in y) {
            if (Object.prototype.hasOwnProperty.call(y, p) && !Object.prototype.hasOwnProperty.call(x, p)) {
                return false;
                // allows x[ p ] to be set to undefined
            }
        }
        return true;
    }
    async _compactAll() {
        const items = duplicate(this.item.getFlag("itemcollection", "contentsData"));
        const mergedItems = {};
        const keptItems = [];
        for (const itemData of items) {
            if (!itemData.flags.itemcollection?.contentsData) {
                let canMerge = false;
                if (mergedItems[itemData.name]) {
                    // let diffs = Object.keys(diffObject(mergedItems[itemData.name].data, itemData.system));
                    // canMerge = (diffs.length === 0) || (diffs.length === 1 && diffs[0] === "quantity")
                    // TODO consideer if we need to include flags & effects in the compare.
                    canMerge = this.object_equals(mergedItems[itemData.name].system, itemData.system);
                }
                ;
                if (mergedItems[itemData.name] && canMerge) {
                    const oldQ = parseInt(mergedItems[itemData.name].system.quantity);
                    const increment = parseInt(itemData.system.quantity || 1);
                    if (mergedItems[itemData.name].system.quantity)
                        mergedItems[itemData.name].system.quantity = oldQ + increment;
                }
                else if (mergedItems[itemData.name]) { // we would like to merge but can't
                    keptItems.push(itemData);
                }
                else {
                    mergedItems[itemData.name] = itemData;
                }
            }
            else
                keptItems.push(itemData);
        }
        const newItems = Object.values(mergedItems).concat(keptItems);
        const toDelete = items.map(i => i._id);
        Hooks.once("updateItem", () => {
            this.item.deleteEmbeddedDocuments("Item", toDelete);
        });
        return this.item.createEmbeddedDocuments("Item", newItems);
    }
    async _exportAll(event) {
        if (!isNewerVersion(game.version, "0.8.9")) {
            warn("Disabled due to bugs - use drag and drop or single item export", true);
            return;
        }
        if (!this.item.parent)
            return;
        if (this.item.items.length === 0)
            return;
        const itemsData = duplicate(getProperty(this.item.flags, "itemcollection.contentsData") ?? []);
        const toDelete = itemsData.map(idata => idata._id);
        await this.item.parent.createEmbeddedDocuments("Item", itemsData);
        await this.updateParentCurrency(this.item.system.currency);
        await this.item.deleteEmbeddedDocuments("Item", toDelete);
        // this.render(true);
    }
    getParentCurrency() {
        if (!this.item.parent)
            return;
        return this.item.parent.system.currency;
    }
    async setParentCurrency(currency) {
        if (!this.item.parent)
            return;
        this.item.parent.update({ "data.currency": currency });
    }
    async updateParentCurrency(addedCurrency) {
        const existingCurrency = this.getParentCurrency();
        // TODO add the currencies together
        const newCurrency = duplicate(this.blankCurrency);
        for (const key of Object.keys(this.blankCurrency)) {
            newCurrency[key] = (addedCurrency[key] ?? 0) + (existingCurrency[key] ?? 0);
        }
        Hooks.once("updateItem", () => {
            this.setParentCurrency(newCurrency);
        });
        await this.item.update({ "data.currency": this.blankCurrency });
    }
    async _editItem(ev) {
        ev.preventDefault();
        const li = $(ev.currentTarget).parents(".item");
        const id = li.attr("data-item-id");
        const item = this.item.items.get(id);
        if (!item) {
            throw error(`Item ${id} not found in Bag ${this.item._id}`, true);
        }
        // let item = this.items[idx];
        return item.sheet?.render(true);
    }
    _onItemSummary(event) {
        // return;
        event.preventDefault();
        const li = $(event.currentTarget).parents(".item");
        const item = this.item.items.get(li.data("item-id"));
        item.getChatData({ secrets: game.user?.isGM }).then(chatData => {
            // Toggle summary
            if (li.hasClass("expanded")) {
                const summary = li.children(".item-summary");
                summary.slideUp(200, () => summary.remove());
            }
            else {
                const div = $(`<div class="item-summary">${chatData.description.value}</div>`);
                const props = $(`<div class="item-properties"></div>`);
                chatData.properties.forEach(p => props.append(`<span class="tag">${p}</span>`));
                div.append(props);
                li.append(div.hide());
                div.slideDown(200);
            }
            li.toggleClass("expanded");
        });
    }
    activateListeners(html) {
        super.activateListeners(html);
        let debouncedCheckFilter = debounce((ev, html) => {
            html.find(".item-inventory-line").each((i, li) => {
                if (li.dataset.itemName?.toLocaleLowerCase().includes(ev.currentTarget.value)) {
                    // $(li).removeClass("hidden");
                    $(li).show();
                }
                else {
                    // $(li).addClass("hidden");
                    $(li).hide();
                }
            });
        }, 200);
        // Everything below is only needed if the sheet is editable
        if (!this.options.editable)
            return;
        // Make the Actor sheet droppable for Items if it is not owned by a token or npc
        if (this.item.type === "backpack") {
            //@ts-ignore TODO fix this
            this.form.ondragover = ev => this._onDragOver(ev);
            //@ts-ignore
            this.form.ondrop = ev => this._onDrop(ev);
            html.find(".item-name-filter").on("input", ev => {
                ev?.preventDefault();
                ev.stopPropagation();
                const filterString = ev.currentTarget.value?.toLocaleLowerCase() ?? "";
                debouncedCheckFilter(ev, html);
            });
            html.find('.item').each((i, li) => {
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", this._onDragItemStart.bind(this), false);
            });
            document.addEventListener("dragend", this._onDragEnd.bind(this));
            // html[0].ondragend = this._onDragEnd.bind(this);
            html.find('.item .item-name.rollable h4').click(event => this._onItemSummary(event));
        }
        html.find("input").focusout(this._onUnfocus.bind(this));
        // Delete Inventory Item
        html.find('.item-delete').click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item"), itemId = li.attr("data-item-id");
            await this.item.deleteEmbeddedDocuments("Item", [itemId]);
            this.render();
        });
        html.find('.item-edit').click(ev => this._editItem(ev));
        html.find('.item-export-all').click(ev => this._exportAll(event));
        html.find('.item-export').click(ev => this._itemExport(ev));
        html.find('.item-compact-all').click(ev => this._compactAll());
        html.find('.item-import-all').click(ev => this._importAllItemsFromParent(this.item.parent));
        html.find('.item-split').click(ev => this._itemSplit(ev));
        html.find('.item-convertToGold').click(ev => this._itemConvertToGold(ev));
        html.find('.item .item-name h4').click(event => this._onItemSummary(event));
        //  html.find('.bag-equipped').click(ev => this._toggleEquipped(ev));
    }
    async _importAllItemsFromParent(parent) {
        if (!isNewerVersion(game.version, "0.8.9")) {
            warn("Disabled due to bugs - use drag and drop", true);
            return;
        }
        if (!parent)
            return;
        const itemsToImport = [];
        for (const testItem of parent.items) {
            if (["weapon", "equipment", "consumable", "tool", "loot", "spell"].includes(testItem.type))
                itemsToImport.push(testItem.toObject(false));
        }
        //@ts-ignore ._id
        const itemsToDelete = itemsToImport.map(itemData => itemData._id);
        await this.item.createEmbeddedDocuments("Item", itemsToImport);
        await parent.deleteEmbeddedDocuments("Item", itemsToDelete);
        this.render();
    }
    _onDragEnd(event) {
        event.preventDefault();
        return false;
    }
    _onDragOver(event) {
        event.preventDefault();
        return false;
    }
    _onUnfocus(event) {
        //@ts-ignore
        this._submitting = true;
        setTimeout(() => {
            const hasFocus = $(":focus").length;
            if (!hasFocus) {
                this._onSubmit(event);
            }
            //@ts-ignore
            this._submitting = false;
        }, 25);
    }
}
