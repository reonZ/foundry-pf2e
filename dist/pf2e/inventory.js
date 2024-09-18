"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSufficientCoins = void 0;
function hasSufficientCoins(actor, value, byValue = true) {
    const coinsToRemove = new game.pf2e.Coins(value);
    const actorCoins = actor.inventory.coins;
    const coinsToAdd = new game.pf2e.Coins();
    if (byValue) {
        let valueToRemoveInCopper = coinsToRemove.copperValue;
        if (valueToRemoveInCopper > actorCoins.copperValue) {
            return false;
        }
        // Choose quantities of each coin to remove from smallest to largest to ensure we don't end in a situation
        // where we need to break a coin that has already been "removed"
        if (valueToRemoveInCopper % 10 > actorCoins.cp) {
            coinsToAdd.cp = 10;
            coinsToRemove.cp = valueToRemoveInCopper % 10;
            valueToRemoveInCopper += 10 - coinsToRemove.cp;
        }
        else {
            coinsToRemove.cp = valueToRemoveInCopper % 10; //  remove the units that other coins can't handle first
            valueToRemoveInCopper -= coinsToRemove.cp;
            const newCopper = actorCoins.cp - coinsToRemove.cp;
            const extraCopper = Math.min(valueToRemoveInCopper / 10, Math.trunc(newCopper / 10)) * 10;
            coinsToRemove.cp += extraCopper;
            valueToRemoveInCopper -= extraCopper;
        }
        if ((valueToRemoveInCopper / 10) % 10 > actorCoins.sp) {
            coinsToAdd.sp = 10;
            coinsToRemove.sp = (valueToRemoveInCopper / 10) % 10;
            valueToRemoveInCopper += 100 - coinsToRemove.sp * 10;
        }
        else {
            coinsToRemove.sp = (valueToRemoveInCopper / 10) % 10; //  remove the units that other coins can't handle first
            valueToRemoveInCopper -= coinsToRemove.sp * 10;
            const newSilver = actorCoins.sp - coinsToRemove.sp;
            const extraSilver = Math.min(valueToRemoveInCopper / 100, Math.trunc(newSilver / 10)) * 10;
            coinsToRemove.sp += extraSilver;
            valueToRemoveInCopper -= extraSilver * 10;
        }
        if ((valueToRemoveInCopper / 100) % 10 > actorCoins.gp) {
            coinsToAdd.gp = 10;
            coinsToRemove.gp = (valueToRemoveInCopper / 100) % 10;
            valueToRemoveInCopper += 1000 - coinsToRemove.gp * 100;
        }
        else {
            coinsToRemove.gp = (valueToRemoveInCopper / 100) % 10; //  remove the units that other coins can't handle first
            valueToRemoveInCopper -= coinsToRemove.gp * 100;
            const newGold = actorCoins.gp - coinsToRemove.gp;
            const extraGold = Math.min(valueToRemoveInCopper / 1000, Math.trunc(newGold / 10)) * 10;
            coinsToRemove.gp += extraGold;
            valueToRemoveInCopper -= extraGold * 100;
        }
        coinsToRemove.pp = valueToRemoveInCopper / 1000;
    }
    // Test if the actor has enough coins to pull
    const coinsToPull = actorCoins.plus(coinsToAdd);
    return (coinsToRemove.pp <= coinsToPull.pp &&
        coinsToRemove.gp <= coinsToPull.gp &&
        coinsToRemove.sp <= coinsToPull.sp &&
        coinsToRemove.cp <= coinsToPull.cp);
}
exports.hasSufficientCoins = hasSufficientCoins;
