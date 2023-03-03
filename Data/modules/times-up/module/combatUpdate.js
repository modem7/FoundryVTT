import { effectQueue } from "./settings.js";
import { dae, debug, error, log, warn } from "../times-up.js";
import { getMacroRepeat, removeOrDisableEffects, socketlibSocket } from "./timeUpdates.js";
import { GMAction, removeConcentrationEffects } from "./utils.js";
export async function handlePreUpdateCombat(update, options, user) {
    // Set round/turn expriy for actors with no duration
    for (let turn of this.turns) {
        const turnActor = turn.actor ? turn.actor : turn.token.actor;
        if (!turnActor)
            return;
        // Update the durations for any effects that don't have a start time
        // update the duration for "short" effects to be in rounds/turns
        let requiredEffects = turnActor.temporaryEffects?.filter(ef => ef.duration &&
            (ef.duration.rounds || ef.duration.turns)
            && !(ef.duration.startRound || ef.duration.startTurn));
        let ammendedEffects = requiredEffects.map(ef => {
            let efData = duplicate(ef);
            efData.duration.startRound = update.round ?? this.round ?? 0;
            efData.duration.startTurn = update.turn ?? this.turn ?? 0;
            return efData;
        });
        if (ammendedEffects.length > 0)
            await turnActor.updateEmbeddedDocuments("ActiveEffect", ammendedEffects);
        const actorEffects = turnActor.temporaryEffects;
        //@ts-ignore toNearest Since world time has not updated yet we need to compute future duration
        const targetDuration = (((update.round ?? this.round) - this.round) + ((update.turn ?? this.turn) - this.turn) / 100).toNearest(0.01);
        //TODO see if skipping seconds based expiry is sensible since it will still fire on the updates
        let expiredEffects = actorEffects?.filter(ef => {
            ef._prepareDuration(); // TODO remove this if v10 change made
            const duration = ef.duration;
            return duration && duration.remaining <= targetDuration && duration.type === "turns";
        });
        expiredEffects = removeConcentrationEffects(turnActor, expiredEffects);
        if (expiredEffects.length > 0) {
            try {
                await removeOrDisableEffects(turnActor, expiredEffects, "times-up:duration:turns");
            }
            catch (err) {
                console.warn("delete effect failed ", err);
            }
        }
        expiredEffects.forEach(efId => effectQueue.effects.delete(efId));
    }
    ;
    const currentTurn = (update.round ?? this.round) * this.turns.length + (update.turn ?? this.turn);
    let startTurn = this.round * this.turns.length + this.turn;
    for (let checkTurn = startTurn; checkTurn <= currentTurn; checkTurn++) {
        const turn = this.turns[checkTurn % this.turns.length];
        // do macro repeat actors
        // const prevTurn = (this.turn + this.turns.length - 1) % this.turns.length
        if (dae) {
            const turnActor = turn.actor ? turn.actor : turn.token?.actor;
            turnActor.effects?.filter(async (ef) => {
                switch (getMacroRepeat(ef)) {
                    case "startEveryTurn":
                        if (checkTurn > startTurn)
                            dae.daeMacro("each", turnActor, ef, { actor: turnActor, effectId: ef.id, tokenId: turn.token.id, actorUuid: turnActor.uuid, actorID: turnActor.id, efData: ef });
                        break;
                    case "endEveryTurn":
                        if (checkTurn < currentTurn)
                            dae.daeMacro("each", turnActor, ef, { actor: turnActor, effectId: ef.id, tokenId: turn.token.id, actorUuid: turnActor.uuid, actorID: turnActor.id, efData: ef });
                        break;
                }
            });
        }
        // Check turnstart/turnEnd effects
        let expiredEffects = turn?.actor?.effects?.filter(ef => {
            let specialDuration = ef.flags?.dae?.specialDuration;
            if (!specialDuration || !(ef.flags.dae.specialDuration instanceof Array))
                specialDuration = [];
            const effectStartTurn = ef.duration.startRound * this.turns.length + ef.duration.startTurn;
            return ((specialDuration.includes("turnStart") && (checkTurn > startTurn))
                || (specialDuration?.includes("turnEnd") && (checkTurn < currentTurn) && (effectStartTurn !== checkTurn)));
        });
        const turnActor = turn.actor ? turn.actor : turn.token?.actor;
        if (!turnActor)
            continue;
        expiredEffects = removeConcentrationEffects(turnActor, expiredEffects);
        if (expiredEffects?.length > 0) {
            // expiredEffects = expiredEffects.map(ef => ef.id);
            try {
                await removeOrDisableEffects(turnActor, expiredEffects, "times-up:turn-start-end");
                // await turnActor.deleteEmbeddedDocuments("ActiveEffect", expiredEffects);
            }
            catch (err) {
                log("effect delete failed ", err);
            }
        }
        // delete turnStartSource/turnEndSource effects that expire 
        const turnStart = checkTurn > startTurn;
        for (let targetTurn of this.turns) { //
            let expiredEffects = targetTurn?.actor?.effects?.filter(ef => {
                let specialDuration = ef.flags?.dae?.specialDuration;
                if (!specialDuration || !(ef.flags.dae.specialDuration instanceof Array))
                    specialDuration = [];
                if (specialDuration.some(sd => ["turnStartSource", "turnEndSource"].includes(sd))) {
                    if (!ef.origin.startsWith(turn.actor?.uuid))
                        return false;
                    const effectStartTurn = ef.duration.startRound * this.turns.length + ef.duration.startTurn;
                    if ((specialDuration.includes("turnStartSource") && (checkTurn > startTurn))
                        || (specialDuration?.includes("turnEndSource") && (checkTurn < currentTurn) && (effectStartTurn !== checkTurn)))
                        return true;
                }
                return false;
            });
            const targetTurnActor = targetTurn.actor ? targetTurn.actor : targetTurn.token?.actor;
            if (!targetTurnActor)
                continue;
            expiredEffects = removeConcentrationEffects(targetTurnActor, expiredEffects);
            if (expiredEffects?.length > 0) {
                // expiredEffects = expiredEffects.map(ef => ef.id);
                try {
                    await removeOrDisableEffects(targetTurnActor, expiredEffects, "times-up:duration-special");
                    // await targetTurnActor.deleteEmbeddedDocuments("ActiveEffect", expiredEffects);
                }
                catch (err) {
                    log("effect delete failed ", err);
                }
            }
        }
    }
}
export async function preUpdateCombat(wrapped, update, options, user) {
    debug("pre update combat ", this.turn, update, this.turns, this.prevTurn);
    try {
        if (update.round !== undefined || update.turn !== undefined) {
            if (!game.user.isGM) { // users can update the combat but not the other things that need doing so hand it off to a GM
                const activeGMId = game.users.find(u => u.isGM && u.active).id;
                await new Promise(resolve => {
                    let timeoutId = setTimeout(() => {
                        error("could not contact GM client - aborting update combat");
                        resolve(undefined);
                    }, 10000);
                    socketlibSocket.executeAsUser("handlePreUpdateCombat", activeGMId, this.id, { round: update.round, turn: update.turn }, options, user)
                        .then((value) => {
                        clearTimeout(timeoutId);
                        resolve(value);
                    });
                });
            }
            else {
                await handlePreUpdateCombat.bind(this)({ round: update.round, turn: update.turn }, options, user);
            }
        }
    }
    catch (err) {
        error("Could not process combat update ", err);
    }
    finally {
        return wrapped(update, options, user);
    }
}
export function readyCombatSetup() {
    if (game.user.isGM) {
        Hooks.on("preDeleteCombat", (combat, options, userId) => {
            combat.turns.forEach(async (turn) => {
                const turnActor = turn.actor ? turn.actor : turn.token.actor;
                if (!turnActor)
                    return;
                // Assume round/turn spells expire on completion of combat
                let expiredEffects = turnActor.temporaryEffects?.filter(ef => {
                    ef._prepareDuration(); // TODO remove if v10 change made
                    return ((ef.duration?.rounds || ef.duration?.turns) && ef.duration?.remaining < 1);
                });
                expiredEffects = expiredEffects.map(ef => ef.id || ef.id);
                if (expiredEffects.length > 0) {
                    warn("Deleting effects ", turnActor, expiredEffects);
                    await turnActor.updateEmbeddedDocuments("ActiveEffect", expiredEffects);
                }
                let updatedEffects = turnActor.temporaryEffects?.filter(ef => {
                    ef._prepareDuration(); // TODO remove this if v10 change made
                    return ef.duration && ((ef.duration.rounds || ef.duration.turns) && ef.duration.remaining > 1);
                }).map(ef => {
                    // TODO lookup seconds per round.
                    ef.duration.seconds = Math.floor(ef.duration.rounds) * CONFIG.time.roundTime;
                    ef.duration.rounds = 0;
                    ef.duration.turns = 0;
                    if (ef.duration?.seconds)
                        GMAction("createEffect", ef.parent, ef);
                    return ef;
                });
                if (updatedEffects.length > 0) {
                    await turnActor.updateEmbeddedDocuments("ActiveEffect", updatedEffects);
                    warn("Upadting effects ", turnActor, expiredEffects);
                }
            });
        });
    }
}
