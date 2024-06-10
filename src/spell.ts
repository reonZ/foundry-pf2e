import { ordinalString } from "./pf2e";

function hasSpells(actor: ActorPF2e) {
    return (
        actor.isOfType("character", "npc") &&
        actor.spellcasting.contents.some(
            (entry) =>
                (entry.spells?.size && entry.spells?.size > 0) ||
                (entry.isEphemeral && entry.id.endsWith("-casting"))
        )
    );
}

function getRankLabel(rank: ZeroToTen) {
    return game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
        rank: ordinalString(rank),
    });
}

export { getRankLabel, hasSpells };
