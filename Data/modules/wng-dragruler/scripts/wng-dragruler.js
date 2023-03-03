Hooks.once("dragRuler.ready", (SpeedProvider) => {
    class WnGSpeedProvider extends SpeedProvider {
        get colors() {
            return [
                // Some colors duplicated. I wanted to get this uploaded and rushed these out
                {id: "crawl", default: 0xB45205, name: "Crawl"},
                {id: "standard", default: 0x79F12F, name: "Standard"},
                {id: "run", default: 0xF1DF2F, name: "Run"},
                {id: "sprint", default: 0xF16D2F, name: "Sprint"},
                {id: "swim", default: 0x2FE1F1, name: "Swim"},
                {id: "fly", default: 0x2F86F1, name: "Fly"},
                {id: "stealth", default: 0x702FF1, name: "Stealth"},
                {id: "jumppack", default: 0xE62FF1, name: "Jump Pack"},
                {id: "fulldefence", default: 0xB45205, name: "Full Defence"},
                {id: "charge", default: 0xF16D2F, name: "Charge"},
                {id: "fallback", default: 0xB45205, name: "Fall Back"},
                {id: "climb", default: 0xB45205, name: "Climb"}
            ]
        }

        getRanges(token) {
            let landSpeed = token.actor.data.data.combat.speed
            let flySpeed = token.actor.data.data.combat.fly
            // Item list to check if Jump Pack is carried
            let itemlist = []
            for (let f of token.actor?.items) {
                itemlist.push(f?.data.name)
            }
            // Check terrain environment under token for swimming
            // TODO: replace canvas.terrain.terrainFromPixels with canvas.terrain.terrainFromGrid
            console.log("Loading terrain type...")
            //let terrainDefault = [{environment: {id: "global"}}]
            //let terrainName = "global"
            //if ('id' in canvas.terrain.terrainFromPixels(token.data.x, token.data.y)[0]?.environment) {
            let terrainName = canvas.terrain?.terrainFromPixels(token.data.x, token.data.y)[0]?.environment?.id ?? "global"
            //console.log("Terrain type is", terrainName)
            //} else {
            console.log("Terrain type is", terrainName)
            //}
            // Range types
            let crawl = {range: landSpeed / 2, color: "crawl"}
            let standard = {range: landSpeed, color: "standard"}
            let run = {range: landSpeed * 2, color: "run"}
            let sprint = {range: landSpeed * 3, color: "sprint"}
            // Assuming 'water' terrain environment is x2 movement cost.
            let swim = {range: landSpeed, color: "swim"}
            let fly = {range: flySpeed, color: "fly"}
            let jumppack = {range: landSpeed * 2, color: "jumppack"}
            // Stealth movement cost added in condition check
            let stealth = {range: landSpeed / 2, color: "stealth"}
            let fulldefence = {range: landSpeed / 2, color: "fulldefence"}
            let charge = {range: landSpeed * 2, color: "charge"}
            // Assuming a token can use its fly speed when climbing
            let climb = {range: landSpeed / 2, color: "climb"}
            let fallback = {range: landSpeed / 2, color: "fallback"}
            // Default movement ranges, these are modified by conditions, terrain, elevation, and Jump Pack
            let ranges = [
                crawl,
                standard,
                run,
                sprint,
                fallback,
                charge,
                climb
            ]
            // If a token is "Dying", use the combat tracker to "Mark Defeated"
            if (token.data?.overlayEffect === "icons/svg/skull.svg") {
                ranges = [
                    crawl,
                    fallback
                ]
                return ranges
            }
            if (token.actor.hasCondition("exhausted")) {
                ranges = [
                    crawl,
                    standard,
                    fallback
                ]
                return ranges
            }
            if (token.actor.hasCondition("staggered")) {
                ranges = [
                    crawl,
                    standard,
                    fallback
                ]
                return ranges
            }
            if (token.actor.hasCondition("prone")) {
                ranges = [
                    crawl
                ]
                return ranges
            }
            /*If a token can and will be flying or using a Jump Pack then
              set elevation with token HUD to +1 before starting movement*/
            if (token.data.elevation > 0) {
                if (flySpeed > 0) {
                    ranges = [
                        fly,
                        fallback
                    ]
                } else {
                    ranges = []
                }
                if (itemlist.indexOf("Jump Pack") >= 0) {
                    ranges.push(jumppack)
                    console.log("adding Jump Pack")
                }
                return ranges
            }
            //if (terrain[0]?.environment?.id === "water") {
            if (terrainName === "water") {
                ranges = [
                    swim
                ]
                return ranges
            }
            // Assuming a token can crawl and climb while sneaking
            if (token.data.hidden) {
                ranges = [
                    stealth,
                    crawl,
                    climb
                ]
                return ranges
            }
            if (token.actor.hasCondition("restrained")) {
                ranges = []
                return ranges
            }
            if (token.actor.hasCondition("all-out-attack")) {
                ranges = []
                return ranges
            }
            if (token.actor.hasCondition("full-defence")) {
                ranges = [
                    fulldefence
                ]
                return ranges
            }
            return ranges
        }
    }

    dragRuler.registerModule("wng-dragruler", WnGSpeedProvider)
})