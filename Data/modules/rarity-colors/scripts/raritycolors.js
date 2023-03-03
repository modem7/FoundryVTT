Hooks.on('renderActorSheet', (actor, html) => {
    if(!game.settings.get("rarity-colors", "rarityFlag")) return
    let items = html.find($(".items-list .item"))
    for(let i of items) {
        let id = i.outerHTML.match(/data-item-id="(.*?)"/)
        if(!id) return
        let rarity = actor.object.items.get(id[1]).data.data?.rarity
        if(rarity !== "" && rarity !== undefined) i.classList.add(rarity.slugify().toLowerCase())
    }
});

Hooks.on("renderSidebarTab", (bar, html) => {
    let rarityFlag = game.settings.get("rarity-colors", "rarityFlag")
    let spellFlag = game.settings.get("rarity-colors", "spellFlag")
    let featFlag = game.settings.get("rarity-colors", "featFlag")
    let items = html.find(".directory-item.document.item")
    for(let i of items) {
        let id = i.outerHTML.match(/data-document-id="(.*?)"/)
        if(!id) return
        let item = game.items.get(id[1])
        let rarity = item.data.data.rarity
        let type = item.data.type
        if(rarity !== "" && rarity !== undefined && rarityFlag) i.classList.add(rarity.slugify().toLowerCase())
        if(type === "spell" && spellFlag) i.classList.add("spell")
        if(type === "feat" && featFlag) i.classList.add("feat")
    }
})
