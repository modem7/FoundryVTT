class DeadlyEncounterBenchmark {  
       
    //Fraction Option + No Token Outline
    static _activeDEBM() {
        
        //Warning message if no tokens selected
        let selected = canvas.tokens.controlled;
        if(selected.length == 0){
            ui.notifications.error("Please select at least 1 token.")
        }

        //DEFINITIONS

        //Defining selectedfriendly tokens (including neutral tokens) vs. hostile tokens
        const [tokenFriendly, tokenHostile] = canvas.tokens.controlled.partition(t => {
            return t.document.disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE;
        });

        //Further defining selected friendly and hostile tokens
        let selectedHostile = tokenHostile
        let selectedFriendly = tokenFriendly

        //Defining selected Friendly NPCs tokens vs characters tokens
        const [selectedFriendlyNPC, selectedFriendlyCharacter] = selectedFriendly.partition(t => {
            return t.actor.type === "character";
        });

        //Further defining selected friendly NPCs and Characters
        let sfNPC = selectedFriendlyNPC
        let sfCharacter = selectedFriendlyCharacter

        //CALCULATIONS

        //Calculating CR of friendly selected NPC tokens
        let CR = 0;
        let friendlyCR = 0;
        for (let token of sfNPC.filter(tok=>!!tok.actor.system.details.cr)) {
            friendlyCR += token.actor.system.details.cr
        }

        //Calculating CR of hostile selected tokens
        for (let token of selectedHostile.filter(tok=>!!tok.actor.system.details.cr)) {
            CR += token.actor.system.details.cr
        }

        //Calculating Deadly Encounter Benchmark (DEBM)
        let DEBM = 0;
        let levelMod = 0;
        for (let token of sfCharacter.filter(tok=>!!tok.actor.system.details.level)) {
            if(token.actor.system.details.level < 5){levelMod = 0.25};
            if(token.actor.system.details.level == 5 || token.actor.system.details.level > 5){levelMod = 0.5};
            DEBM += token.actor.system.details.level*levelMod
        }

        //DIALOG BOX

        //Defining options dialog box for Monster CR
        let npcOptions = ""
        for(let token of selectedHostile){
            if (token.actor.type != "character"){
            let cr = token.actor.system.details.cr;
                if (!cr){cr = "n/a"}
                if (game.settings.get("deadly-encounter-benchmark", "fraction-option")) {
                    let fcr = cr
                    if (cr < 1 && cr == 0.125){cr = "1???8"}
                    if (cr < 1 && cr == 0.25){cr = "1???4"}
                    if (cr < 1 && cr == 0.375){cr = "3???8"}
                    if (cr < 1 && cr == 0.5){cr = "1???2"}
                    if (cr < 1 && cr == 0.625){cr = "5???8"}
                    if (cr < 1 && cr == 0.75){cr = "3???4"}
                    if (cr < 1 && cr == 0.875){cr = "7???8"}
                }
                npcOptions += `<option value=${selected}>${token.document.name} | CR: ${cr}</option>`
            }
        }

        //Defining options of dialog box for Player Level
        let playerOptions = ""
        for(let token of selected){
            if (token.actor.type != "npc"){
            let level = token.actor.system.details.level;
                if (!level){level = "n/a"}
            playerOptions += `<option value=${selected}>${token.document.name} | Level: ${level}</option>`
            }
        }

        //Defining options dialog box for Friendly NPC CR
        let fnpcOptions = ""
        for(let token of selectedFriendly){
            if (token.actor.type != "character"){
            let cr = token.actor.system.details.cr;
                if (!cr){cr = "n/a"}
                if (game.settings.get("deadly-encounter-benchmark", "fraction-option")) {
                    let fcr = cr
                    if (cr < 1 && cr == 0.125){cr = "1???8"}
                    if (cr < 1 && cr == 0.25){cr = "1???4"}
                    if (cr < 1 && cr == 0.375){cr = "3???8"}
                    if (cr < 1 && cr == 0.5){cr = "1???2"}
                    if (cr < 1 && cr == 0.625){cr = "5???8"}
                    if (cr < 1 && cr == 0.75){cr = "3???4"}
                    if (cr < 1 && cr == 0.875){cr = "7???8"}
                }
            fnpcOptions += `<option value=${selected}>${token.document.name} | CR: ${cr}</option>`
            }
        }

        //Warning messages that are displayed in dialog box
        let newCR = 0;
        let newDEBM = 0;
        let zeroCR = 0;
        let zeroDEBM = 0;
        if (CR == 0){
                newCR = "<font color='grey'><i>No monster tokens selected</i></font> <font color='#b94a48'><i class='fa-solid fa-triangle-exclamation'></i></font>";
                npcOptions = "<font color='grey'><i>No monster tokens selected</i></font> <font color='#b94a48'><i class='fa-solid fa-triangle-exclamation'></i></font>";
                zeroCR = "<font color='grey'>n/a</font> <span title='Monster CR'><i class='fa-solid fa-swords'></i></span>"
            }
        if (DEBM == 0){
                newDEBM = "<font color='grey'><i>No player tokens selected</i></font> <font color='#b94a48'><i class='fa-solid fa-triangle-exclamation'></i></font>";
                playerOptions = "<font color='grey'><i>No player tokens selected</i></font> <font color='#b94a48'><i class='fa-solid fa-triangle-exclamation'></i></font>";
                zeroDEBM = "<font color='grey'>n/a</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>"
            }
        if (friendlyCR == 0){
                fnpcOptions = "<font color='grey'><i>No friendly NPC tokens selected</i></font> <font color='#b94a48'><i class='fa-solid fa-triangle-exclamation'></i></font>"
        }
        if (CR > 0){
                newCR = "<font color='#b94a48'>" + CR + "</font> <span title='Monster CR'><i class='fa-solid fa-swords'></i></span>";
                zeroCR = "<font color='#b94a48'>" + CR + "</font> <span title='Monster CR'><i class='fa-solid fa-swords'></i></span>"
            }
        if (DEBM > 0 || friendlyCR != 0){
                newDEBM = (DEBM + friendlyCR);
                zeroDEBM = (DEBM + friendlyCR);
            }
        
        let textDEBM = "<font color='#b94a48'>" + (newDEBM) + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>";
        let textZeroDEBM = "<font color='#b94a48'>" + (newDEBM) + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>";
        //Fractions
        if (game.settings.get("deadly-encounter-benchmark", "fraction-option")) {
            if(newDEBM < 1 && newDEBM == 0.125){textDEBM = "<font color='#b94a48'>" + "1???8" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>";
                                          textZeroDEBM = "<font color='#b94a48'>" + "1???8" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>"}
            if(newDEBM < 1 && newDEBM == 0.25){textDEBM = "<font color='#b94a48'>" + "1???4" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>";
                                            textZeroDEBM = "<font color='#b94a48'>" + "1???4" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>"}
            if(newDEBM < 1 && newDEBM == 0.375){textDEBM = "<font color='#b94a48'>" + "3???8" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>";
                                            textZeroDEBM = "<font color='#b94a48'>" + "3???8" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>"}
            if(newDEBM < 1 && newDEBM == 0.5){textDEBM = "<font color='#b94a48'>" + "1???2" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>";
                                            textZeroDEBM = "<font color='#b94a48'>" + "1???2" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>"}
            if(newDEBM < 1 && newDEBM == 0.625){textDEBM = "<font color='#b94a48'>" + "5???8" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>";
                                            textZeroDEBM = "<font color='#b94a48'>" + "5???8" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>"}
            if(newDEBM < 1 && newDEBM == 0.75){textDEBM = "<font color='#b94a48'>" + "3???4" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>";
                                            textZeroDEBM = "<font color='#b94a48'>" + "3???4" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>"}
            if(newDEBM < 1 && newDEBM == 0.875){textDEBM = "<font color='#b94a48'>" + "7???8" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>";
                                            textZeroDEBM = "<font color='#b94a48'>" + "7???8" + "</font> <span title='Deadly Encounter Benchmark'><i class='fa-solid fa-shield-check'></i></span>"}

            if(CR < 1 && CR == 0.125){newCR = "<font color='#b94a48'>" + "1???8" + "</font> <span title='Monster CR'><i class='fa-solid fa-swords'></i></span>";
                                      zeroCR = "<font color='#b94a48'>" + "1???8" + "</font> <span title='Monster CR'><i class='fa-solid fa-swords'></i></span>"}
            if(CR < 1 && CR == 0.25){newCR = "<font color='#b94a48'>" + "1???4" + "</font> <span title='Monster Token CR'><i class='fa-solid fa-swords'></i></span>";
                                     zeroCR = "<font color='#b94a48'>" + "1???4" + "</font> <span title='Monster CR'><i class='fa-solid fa-swords'></i></span>"}
            if(CR < 1 && CR == 0.375){newCR = "<font color='#b94a48'>" + "3???8" + "</font> <span title='Monster Token CR'><i class='fa-solid fa-swords'></i></span>";
                                      zeroCR = "<font color='#b94a48'>" + "3???8" + "</font> <span title='Monster CR'><i class='fa-solid fa-swords'></i></span>"}
            if(CR < 1 && CR == 0.5){newCR = "<font color='#b94a48'>" + "1???2" + "</font> <span title='Monster Token CR'><i class='fa-solid fa-swords'></i></span>";
                                    zeroCR = "<font color='#b94a48'>" + "1???2" + "</font> <span title='Monster CR'><i class='fa-solid fa-swords'></i></span>"}
            if(CR < 1 && CR == 0.625){newCR = "<font color='#b94a48'>" + "5???8" + "</font> <span title='Monster Token CR'><i class='fa-solid fa-swords'></i></span>";
                                      zeroCR = "<font color='#b94a48'>" + "5???8" + "</font> <span title='Monster CR'><i class='fa-solid fa-swords'></i></span>"}
            if(CR < 1 && CR == 0.75){newCR = "<font color='#b94a48'>" + "3???4" + "</font> <span title='Monster Token CR'><i class='fa-solid fa-swords'></i></span>";
                                     zeroCR = "<font color='#b94a48'>" + "3???4" + "</font> <span title='Monster CR'><i class='fa-solid fa-swords'></i></span>"}
            if(CR < 1 && CR === 0.875){newCR = "<font color='#b94a48'>" + "7???8" + "</font> <span title='Monster Token CR'><i class='fa-solid fa-swords'></i></span>";
                                      zeroCR = "<font color='#b94a48'>" + "7???8" + "</font> <span title='Monster CR'><i class='fa-solid fa-swords'></i></span>"}
        }

        //Is the encounter deadly?
        let isDeadly = 0;
        if(CR > DEBM + friendlyCR){
            if (game.settings.get("deadly-encounter-benchmark", "wordtip-option")) {isDeadly = 
                `
                <div class="wordtip"><center><span class="isdeadly-backgroundClear">This encounter may be</span><span class="isdeadly-backgroundRed">Deadly</span></center>
                <span class="wordtiptext">${textDEBM} is less than ${newCR}</span>
                </div>
                `
            }
            else {isDeadly = 
                `
                <div class="padding"><center><span class="isdeadly-backgroundClear">This encounter may be</span><span class="isdeadly-backgroundRed">Deadly</span></center>
                </div>
                `
            }
        }

        if(CR == DEBM + friendlyCR){
            if (game.settings.get("deadly-encounter-benchmark", "wordtip-option")) {isDeadly = 
                `
                <div class="wordtip"><center><span class="isdeadly-backgroundClear">This encounter may be</span><span class="isdeadly-backgroundOrange">Challenging</span></center>
                <span class="wordtiptext">${textDEBM} is equal to ${newCR}</span>
                </div>
                `
            }
            else {isDeadly = 
                `
                <div class="padding"><center><span class="isdeadly-backgroundClear">This encounter may be</span><span class="isdeadly-backgroundOrange">Challenging</span></center>
                </div>
                `
            }
        }

        if(CR < DEBM + friendlyCR){
            if (game.settings.get("deadly-encounter-benchmark", "wordtip-option")) {isDeadly = 
                `
                <div class="wordtip"><center><span class="isdeadly-backgroundClear">This encounter is</span><span class="isdeadly-backgroundGreen">Not Deadly</span></center>
                <span class="wordtiptext">${textDEBM} is greater than ${newCR}</span>
                </div>
                `
            }
            else {isDeadly = 
                `
                <div class="padding"><center><span class="isdeadly-backgroundClear">This encounter is</span><span class="isdeadly-backgroundGreen">Not Deadly</span></center>
                </div>
                `
            }
        }

        //Dialog box style
        let dialogTemplate = `
        <div class="dialogbox">
            ${isDeadly}
            <h3></h3> 
            <br>  
            <span><center><font size="3"><b>The Deadly Encounter Benchmark is:</b></font></center></span>
            <span><center><font size="4">${textDEBM}</font></center></span> 
            <br>
            <center><details><summary><b>Player level details (${sfCharacter.length} selected)</b></summary>${playerOptions}</details></center>
            <br>
            <center><details><summary><b>Friendly NPC details (${sfNPC.length} selected)</b></summary>${fnpcOptions}</details></center>
            <br>
            <h3></h3>
            <br>
            <span><center><font size="3"><b>Total Monster CR:</b></font></center></span>
            <span><id="challenge"><font size="4"><center>${newCR}</font></center></span> 
            <br>
            <center><details><summary><b>Hostile NPC details (${selectedHostile.length} selected)</b></summary>${npcOptions}</details></center>
            <br>
            <h3></h3>
            <details><summary><i><b>What is a "Deadly Encounter Benchmark"?</b></i></summary>
                <br>
                <span>A <i>Deadly Encounter Benchmark</i> is a guideline that helps determine an encounter's difficulty.</span>
                <br>
                <br>
                <span>An encounter may be deadly if the total of all the monsters' challenge ratings is greater than 1???4 of the total of all the characters' levels, or 1???2 of the characters' levels if the characters are 5th level or higher.</span>
                <br>
                <br>
                <span>If friendly NPCs join the encounter, their CR values are added to the <i>Deadly Encounter Benchmark</i>.</span>
                </details>
            <br>
        </div>
        `

        //Token Magic FX option
        //Modified from Token Magic FX by Feu-Secret (https://github.com/Feu-Secret/Tokenmagic)
        if (game.settings.get("deadly-encounter-benchmark", "token-outline")) {
            let params =
            [{
                filterType: "glow",
                filterId: "superSpookyGlow",
                autoDestroy: true,
                outerStrength: 4,
                innerStrength: 0,
                color: 0x5099DD,
                quality: 0.5,
                padding: 10,
                animated:
                {
                    color: 
                    {
                    active: true, 
                    loopDuration: 3000,
                    loops: 2,
                    animType: "colorOscillation", 
                    val1:0x5099DD, 
                    val2:0x90EEFF
                    }
                }
            }];
            if (game.modules.get("tokenmagic")?.active) {
                TokenMagic.addUpdateFiltersOnSelected(params)
            } else {
                ui.notifications.warn("Deadly Encounter Benchmark  |  Display Token Outline option selected. Please enable Token Magic FX!");
            }
        }

        //Chat Message Option
        let chatContent = ""
            if(CR > DEBM + friendlyCR){chatContent = 
                `
                <div class="padding"><center><span class="isdeadly-backgroundClear">This encounter may be</span><span class="isdeadly-backgroundRed">Deadly</span></center>
                </div>
                <div class="chat">${textZeroDEBM} | ${zeroCR}</div>
                <p><button id="details">Details</button></p>
                `
            }
            if(CR == DEBM + friendlyCR){chatContent = 
                `
                <div class="padding"><center><span class="isdeadly-backgroundClear">This encounter is</span><span class="isdeadly-backgroundOrange">Challenging</span></center>
                </div>
                <div class="chat">${textZeroDEBM} | ${zeroCR}</div>
                <p><button id="details">Details</button></p>
                `
            }
            if(CR < DEBM + friendlyCR){chatContent = 
                `
                <div class="padding"><center><span class="isdeadly-backgroundClear">This encounter is</span><span class="isdeadly-backgroundGreen">Not Deadly</span></center>
                </div>
                <div class="chat">${textZeroDEBM} | ${zeroCR}</div>
                <p><button id="details">Details</button></p>
                `
            }
        
        const myDialogOptions = {
            resizable: true,
            left: 300
        };

        const chatOption = game.settings.get("deadly-encounter-benchmark", "chat-option");
        
        //Dialog box & Chat message displays
        if (chatOption === 'off') {
            if(selected.length > 0){
                const myDialog = new Dialog({
                    title: "Deadly Encounter Benchmark",
                    content: dialogTemplate,
                    buttons: {
                        calculateDEBM: {
                            label: "Calculate Benchmark",
                            icon: `<i class="fa-solid fa-arrow-rotate-right"></i> `,
                            callback: DeadlyEncounterBenchmark._activeDEBM,
                        },
                        close: {
                            label: "Close",
                            icon: `<i class="fa-solid fa-right-from-bracket"></i> `
                        }
                    }
                }, myDialogOptions).render(true);
            }
        }
        if (chatOption === 'both') {
            if(selected.length > 0){
                const myDialog = new Dialog({
                    title: "Deadly Encounter Benchmark",
                    content: dialogTemplate,
                    buttons: {
                        calculateDEBM: {
                            label: "Calculate Benchmark",
                            icon: `<i class="fa-solid fa-arrow-rotate-right"></i> `,
                            callback: DeadlyEncounterBenchmark._activeDEBM,
                        },
                        close: {
                            label: "Close",
                            icon: `<i class="fa-solid fa-right-from-bracket"></i> `
                        }
                    }
                }, myDialogOptions).render(true);
            }
            ChatMessage.create({
                content: chatContent,
            })
        }
        if (chatOption === 'only') {
            ChatMessage.create({
                content: chatContent,
            })
        }

        //Chat message details button
        Hooks.once('renderChatMessage', (chatItem, html) => {
            html.find("#details").click(() => {
                new Dialog({
                    title: "Deadly Encounter Benchmark",
                    content: dialogTemplate,
                    buttons: {
                        close: {
                            label: "Close",
                            icon: `<i class="fa-solid fa-right-from-bracket"></i> `
                        }
                    }
                }, myDialogOptions).render(true);
            })
        })
    }  
}

//Settings
Hooks.on("init", () => {
    game.settings.register(
        "deadly-encounter-benchmark",
        "chat-option",
        {
            name: "deadly-encounter-benchmark.settings.chat-option",
            hint: "deadly-encounter-benchmark.settings.chat-option-hint",
            scope: "client",
            config: true,
            default: "off",
            choices: {
                "off": "deadly-encounter-benchmark.settings.chat-option-off",
                "only": "deadly-encounter-benchmark.settings.chat-option-only",
                "both": "deadly-encounter-benchmark.settings.chat-option-both"
            },
            type: String,
            onChange: () => window.location.reload()
        }
    );
    game.settings.register(
        "deadly-encounter-benchmark",
        "fraction-option",
        {
            name: "deadly-encounter-benchmark.settings.fraction-option",
            hint: "deadly-encounter-benchmark.settings.fraction-option-hint",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => window.location.reload()
        }
    );
    game.settings.register(
        "deadly-encounter-benchmark",
        "wordtip-option",
        {
            name: "deadly-encounter-benchmark.settings.wordtip-option",
            hint: "deadly-encounter-benchmark.settings.wordtip-option-hint",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: () => window.location.reload()
        }
    );
    game.settings.register(
        "deadly-encounter-benchmark",
        "token-outline",
        {
            name: "deadly-encounter-benchmark.settings.token-outline",
            hint: "deadly-encounter-benchmark.settings.token-outline-hint",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => window.location.reload()
        }
    );
});

//Button
Hooks.on('getSceneControlButtons', (buttons) => {
    if (!game.user.isGM) {return;}
    const basicControlsButton = buttons.find(b => b.name === "token");
    if (basicControlsButton) {
            basicControlsButton.tools.push({
            name: "deadly-encounter-benchmark",
            title: "Deadly Encounter Benchmark",
            icon: 'fas fa-solid fa-shield-check',
            visible: game.user.isGM,
            onClick: DeadlyEncounterBenchmark._activeDEBM,
            button: true
        });
    }  
});