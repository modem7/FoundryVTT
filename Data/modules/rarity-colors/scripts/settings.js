Hooks.on("init", () => {
    game.settings.register("rarity-colors", "rarityFlag", {
        name: game.i18n.format("rarity-colors.rarityFlag.name"),
        hint: game.i18n.format("rarity-colors.rarityFlag.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    })

    game.settings.register("rarity-colors", "spellFlag", {
        name: game.i18n.format("rarity-colors.spellFlag.name"),
        hint: game.i18n.format("rarity-colors.spellFlag.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    })

    game.settings.register("rarity-colors", "featFlag", {
        name: game.i18n.format("rarity-colors.featFlag.name"),
        hint: game.i18n.format("rarity-colors.featFlag.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    })

    game.settings.register("rarity-colors", "uncommon", {
        name: 'Uncommon',
        scope: 'client',
        type: String,
        default: "#008000",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "uncommonExternal", {
        name: 'Uncommon External',
        scope: 'client',
        type: String,
        default: "#006400",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "rare", {
        name: 'Rare',
        scope: 'client',
        type: String,
        default: "#0000FF",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "rareExternal", {
        name: 'Rare External',
        scope: 'client',
        type: String,
        default: "#191970",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "veryrare", {
        name: 'Very Rare',
        scope: 'client',
        type: String,
        default: "#800080",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "veryrareExternal", {
        name: 'Very Rare External',
        scope: 'client',
        type: String,
        default: "#4B0082",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "legendary", {
        name: 'Legendary',
        scope: 'client',
        type: String,
        default: "#FFA500",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "legendaryExternal", {
        name: 'Legendary External',
        scope: 'client',
        type: String,
        default: "#D2691E",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "artifact", {
        name: 'Artifact',
        scope: 'client',
        type: String,
        default: "#D2691E",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "artifactExternal", {
        name: 'Artifact External',
        scope: 'client',
        type: String,
        default: "#91450e",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "spell", {
        name: 'Spell',
        scope: 'client',
        type: String,
        default: "#add8e6",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "spellExternal", {
        name: 'Spell External',
        scope: 'client',
        type: String,
        default: "#0000ff",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "feat", {
        name: 'Feat',
        scope: 'client',
        type: String,
        default: "#48d1cc",
        config: true,
        onChange : refresh,
    });
    game.settings.register("rarity-colors", "featExternal", {
        name: 'Feat External',
        scope: 'client',
        type: String,
        default: "#0e5c59",
        config: true,
        onChange : refresh,
    });

})

Hooks.on('renderSettingsConfig', (app, el, data) => {
    const U = game.settings.get("rarity-colors", "uncommon")
    const UE = game.settings.get("rarity-colors", "uncommonExternal")
    const R = game.settings.get("rarity-colors", "rare")
    const RE = game.settings.get("rarity-colors", "rareExternal")
    const V = game.settings.get("rarity-colors", "veryrare")
    const VE = game.settings.get("rarity-colors", "veryrareExternal")
    const L = game.settings.get("rarity-colors", "legendary")
    const LE = game.settings.get("rarity-colors", "legendaryExternal")
    const A = game.settings.get("rarity-colors", "artifact")
    const AE = game.settings.get("rarity-colors", "artifactExternal")
    const S = game.settings.get("rarity-colors", "spell")
    const SE = game.settings.get("rarity-colors", "spellExternal")
    const F = game.settings.get("rarity-colors", "feat")
    const FE = game.settings.get("rarity-colors", "featExternal")
    el.find('[name="rarity-colors.uncommon"]').parent().append(`<input type="color" value="${U}" data-edit="rarity-colors.uncommon">`)
    el.find('[name="rarity-colors.uncommonExternal"]').parent().append(`<input type="color" value="${UE}" data-edit="rarity-colors.uncommonExternal">`)
    el.find('[name="rarity-colors.rare"]').parent().append(`<input type="color"value="${R}" data-edit="rarity-colors.rare">`)
    el.find('[name="rarity-colors.rareExternal"]').parent().append(`<input type="color" value="${RE}" data-edit="rarity-colors.rareExternal">`)
    el.find('[name="rarity-colors.veryrare"]').parent().append(`<input type="color"value="${V}" data-edit="rarity-colors.veryrare">`)
    el.find('[name="rarity-colors.veryrareExternal"]').parent().append(`<input type="color" value="${VE}" data-edit="rarity-colors.veryrareExternal">`)
    el.find('[name="rarity-colors.legendary"]').parent().append(`<input type="color" value="${L}" data-edit="rarity-colors.legendary">`)
    el.find('[name="rarity-colors.legendaryExternal"]').parent().append(`<input type="color"value="${LE}" data-edit="rarity-colors.legendaryExternal">`)
    el.find('[name="rarity-colors.artifact"]').parent().append(`<input type="color" value="${A}" data-edit="rarity-colors.artifact">`)
    el.find('[name="rarity-colors.artifactExternal"]').parent().append(`<input type="color"value="${AE}" data-edit="rarity-colors.artifactExternal">`)
    el.find('[name="rarity-colors.spell"]').parent().append(`<input type="color" value="${S}" data-edit="rarity-colors.spell">`)
    el.find('[name="rarity-colors.spellExternal"]').parent().append(`<input type="color"value="${SE}" data-edit="rarity-colors.spellExternal">`)
    el.find('[name="rarity-colors.feat"]').parent().append(`<input type="color" value="${F}" data-edit="rarity-colors.feat">`)
    el.find('[name="rarity-colors.featExternal"]').parent().append(`<input type="color"value="${FE}" data-edit="rarity-colors.featExternal">`)
});

Hooks.once('canvasReady', refresh);


function refresh() {
    const U = game.settings.get("rarity-colors", "uncommon")
    const UE = game.settings.get("rarity-colors", "uncommonExternal")
    const R = game.settings.get("rarity-colors", "rare")
    const RE = game.settings.get("rarity-colors", "rareExternal")
    const V = game.settings.get("rarity-colors", "veryrare")
    const VE = game.settings.get("rarity-colors", "veryrareExternal")
    const L = game.settings.get("rarity-colors", "legendary")
    const LE = game.settings.get("rarity-colors", "legendaryExternal")
    const A = game.settings.get("rarity-colors", "artifact")
    const AE = game.settings.get("rarity-colors", "artifactExternal")
    const S = game.settings.get("rarity-colors", "spell")
    const SE = game.settings.get("rarity-colors", "spellExternal")
    const F = game.settings.get("rarity-colors", "feat")
    const FE = game.settings.get("rarity-colors", "featExternal")

    document.documentElement.style.setProperty("--REuncommon", U)
    document.documentElement.style.setProperty("--REuncommonExternal", UE)
    document.documentElement.style.setProperty("--RErare", R)
    document.documentElement.style.setProperty("--RErareExternal", RE)
    document.documentElement.style.setProperty("--REveryrare", V)
    document.documentElement.style.setProperty("--REveryrareExternal", VE)
    document.documentElement.style.setProperty("--RElegendary", L)
    document.documentElement.style.setProperty("--RElegendaryExternal", LE)
    document.documentElement.style.setProperty("--REartifact", A)
    document.documentElement.style.setProperty("--REartifactExternal", AE)
    document.documentElement.style.setProperty("--REspell", S)
    document.documentElement.style.setProperty("--REspellExternal", SE)
    document.documentElement.style.setProperty("--REfeat", F)
    document.documentElement.style.setProperty("--REfeatExternal", FE)

}