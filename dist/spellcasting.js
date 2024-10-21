"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummarizedSpellsDataForRender = exports.getSpellcastingMaxRank = exports.getHighestSyntheticStatistic = exports.getHighestSpellcastingStatistic = exports.getActorMaxRank = exports.createSpellcastingWithHighestStatisticSource = exports.createSpellcastingSource = void 0;
const R = __importStar(require("remeda"));
const item_1 = require("./item");
const localize_1 = require("./localize");
const module_1 = require("./module");
const pf2e_1 = require("./pf2e");
async function getSummarizedSpellsDataForRender(actor, sortByType, staffLabels, entries) {
    entries ??= await Promise.all(actor.spellcasting.collections.map((spells) => spells.entry.getSheetData({ spells })));
    const focusPool = actor.system.resources?.focus ?? { value: 0, max: 0 };
    const pf2eDailies = (0, module_1.getActiveModule)("pf2e-dailies");
    const spells = [];
    const labels = [];
    let hasFocusCantrip = false;
    for (const entry of entries) {
        const entryId = entry.id;
        const entryDc = entry.statistic?.dc.value;
        const entryTooltip = entryDc
            ? `${entry.name} - ${game.i18n.format("PF2E.DCWithValue", { dc: entryDc, text: "" })}`
            : entry.name;
        const isFocus = entry.isFocusPool;
        const isRitual = entry.isRitual;
        const isCharges = entry.category === "charges";
        const isStaff = entry.isStaff;
        const isInnate = entry.isInnate;
        const isPrepared = entry.isPrepared;
        const isSpontaneous = entry.isSpontaneous;
        const isFlexible = entry.isFlexible;
        const item = entry.isEphemeral
            ? actor.items.get(entryId.split("-")[0])
            : undefined;
        const consumable = entry.category === "items" ? item : undefined;
        for (const group of entry.groups) {
            if (!group.active.length || group.uses?.max === 0)
                continue;
            const groupNumber = (0, pf2e_1.spellSlotGroupIdToNumber)(group.id);
            const slotSpells = [];
            const isCantrip = group.id === "cantrips";
            const isBroken = !isCantrip && isCharges && !pf2eDailies;
            const groupUses = typeof group.uses?.value === "number" ? group.uses : undefined;
            for (let slotId = 0; slotId < group.active.length; slotId++) {
                const active = group.active[slotId];
                if (!active?.spell || active.uses?.max === 0)
                    continue;
                const { spell } = active;
                const spellId = spell.id;
                const uses = isCantrip || isFocus || consumable || (isPrepared && !isFlexible)
                    ? undefined
                    : isCharges && !isBroken
                        ? entry.uses
                        : active.uses ?? groupUses;
                slotSpells.push({
                    name: spell.name,
                    itemId: spellId,
                    entryId,
                    groupId: group.id,
                    slotId,
                    parentId: item?.id,
                    action: spell.system.time.value,
                    castRank: active.castRank ?? spell.rank,
                    expended: isFocus ? !isCantrip && focusPool.value <= 0 : active.expended,
                    img: spell.img,
                    range: spell.system.range.value || "-&nbsp;",
                    rank: spell.rank,
                    entryName: entry.name,
                    entryDc,
                    entryTooltip,
                    consumable,
                    isBroken,
                    isFocus,
                    isRitual,
                    isCharges,
                    isStaff,
                    isInnate,
                    isPrepared,
                    isSpontaneous,
                    isFlexible,
                    annotation: item ? (0, item_1.getActionAnnotation)(item) : undefined,
                    uses: uses
                        ? {
                            ...uses,
                            input: isStaff
                                ? ""
                                : isCharges
                                    ? "system.slots.slot1.value"
                                    : isInnate
                                        ? "system.location.uses.value"
                                        : `system.slots.slot${groupNumber}.value`,
                            itemId: isStaff ? "" : isInnate ? spellId : entryId,
                        }
                        : undefined,
                    order: isCharges
                        ? 0
                        : isPrepared
                            ? 1
                            : isFocus
                                ? 2
                                : isInnate
                                    ? 3
                                    : isSpontaneous
                                        ? 4
                                        : 5,
                    category: consumable
                        ? `PF2E.Item.Consumable.Category.${consumable.category}`
                        : isStaff
                            ? staffLabels.staff
                            : isCharges
                                ? staffLabels.charges
                                : isInnate
                                    ? "PF2E.PreparationTypeInnate"
                                    : isSpontaneous
                                        ? "PF2E.PreparationTypeSpontaneous"
                                        : isFlexible
                                            ? "PF2E.SpellFlexibleLabel"
                                            : isFocus
                                                ? "PF2E.TraitFocus"
                                                : "PF2E.SpellPreparedLabel",
                });
            }
            if (slotSpells.length) {
                if (isFocus) {
                    if (isCantrip) {
                        hasFocusCantrip = true;
                    }
                    else {
                        const focusGroup = (spells[12] ??= []);
                        focusGroup.push(...slotSpells);
                        continue;
                    }
                }
                else if (isRitual) {
                    const ritualGroup = (spells[13] ??= []);
                    ritualGroup.push(...slotSpells);
                    continue;
                }
                labels[groupNumber] ??= group.label;
                const spellsGroup = (spells[groupNumber] ??= []);
                spellsGroup.push(...slotSpells);
            }
        }
    }
    if (spells.length) {
        const orderSort = (a, b) => a.order === b.order ? (0, localize_1.localeCompare)(a.name, b.name) : a.order - b.order;
        const nameSort = (a, b) => (0, localize_1.localeCompare)(a.name, b.name);
        const sort = sortByType ? orderSort : nameSort;
        for (let i = 0; i < spells.length; i++) {
            const entry = spells[i];
            if (!entry || i > 11)
                continue;
            entry.sort(sort);
        }
    }
    labels[12] = "PF2E.Focus.Spells";
    labels[13] = "PF2E.Actor.Character.Spellcasting.Tab.Rituals";
    return {
        labels,
        spells,
        focusPool,
        isOwner: actor.isOwner,
        hasFocusCantrip,
    };
}
exports.getSummarizedSpellsDataForRender = getSummarizedSpellsDataForRender;
function getActorMaxRank(actor) {
    return Math.max(1, Math.ceil(actor.level / 2));
}
exports.getActorMaxRank = getActorMaxRank;
function getSpellcastingMaxRank(entry, rankLimit = 10) {
    const slots = entry.system.slots;
    const limit = Math.clamp(rankLimit, 1, 10);
    let maxRank = 0;
    for (let rank = 1; rank <= limit; rank++) {
        const slotKey = `slot${rank}`;
        const slot = slots[slotKey];
        if (slot.max > 0) {
            maxRank = rank;
        }
    }
    return maxRank;
}
exports.getSpellcastingMaxRank = getSpellcastingMaxRank;
function getHighestSpellcastingStatistic(actor) {
    const entries = actor.spellcasting?.spellcastingFeatures;
    if (!entries?.length)
        return;
    const classAttribute = actor.isOfType("character") ? actor.classDC?.attribute : null;
    const groupedEntries = R.groupBy(entries, (entry) => entry.statistic.mod);
    const highestMod = R.pipe(groupedEntries, R.keys(), R.sortBy([(x) => Number(x), "desc"]), R.first());
    const highestResults = groupedEntries[Number(highestMod)].map((entry) => ({
        tradition: entry.tradition,
        statistic: entry.statistic,
    }));
    if (highestResults.length === 1 || !classAttribute) {
        return highestResults[0];
    }
    return (highestResults.find((entry) => entry.statistic.attribute === classAttribute) ||
        highestResults[0]);
}
exports.getHighestSpellcastingStatistic = getHighestSpellcastingStatistic;
function getHighestSyntheticStatistic(actor, withClassDcs = true) {
    const isCharacter = actor.isOfType("character");
    const synthetics = Array.from(actor.synthetics.statistics.values());
    const statistics = withClassDcs && isCharacter
        ? [...synthetics, ...Object.values(actor.classDCs)]
        : synthetics;
    if (!statistics.length)
        return;
    const classStatistic = isCharacter ? actor.classDC : null;
    const groupedStatistics = R.groupBy(statistics, R.prop("mod"));
    const highestMod = R.pipe(R.keys(groupedStatistics), R.firstBy([R.identity(), "desc"]));
    if (classStatistic && highestMod && classStatistic.mod === highestMod) {
        return classStatistic;
    }
    return groupedStatistics[highestMod][0];
}
exports.getHighestSyntheticStatistic = getHighestSyntheticStatistic;
function createSpellcastingWithHighestStatisticSource(actor, { name, category, flags, showSlotlessRanks, sort, withClassDcs, }) {
    const highestEntry = getHighestSpellcastingStatistic(actor);
    const highestSynthetic = getHighestSyntheticStatistic(actor, withClassDcs);
    const [tradition, statistic] = highestEntry && (!highestSynthetic || highestEntry.statistic.mod >= highestSynthetic.mod)
        ? [highestEntry.tradition, highestEntry.statistic]
        : highestSynthetic
            ? [null, highestSynthetic]
            : [null, null];
    if (!statistic)
        return;
    return createSpellcastingSource({
        name,
        sort,
        flags,
        category,
        showSlotlessRanks,
        tradition: tradition ?? "arcane",
        attribute: statistic.attribute,
        proficiencyRank: statistic.rank ?? 1,
        proficiencySlug: statistic === highestSynthetic ? statistic.slug : undefined,
    });
}
exports.createSpellcastingWithHighestStatisticSource = createSpellcastingWithHighestStatisticSource;
function createSpellcastingSource({ name, category, attribute, flags, proficiencyRank, proficiencySlug, showSlotlessRanks, sort, tradition, }) {
    return {
        type: "spellcastingEntry",
        name,
        sort: sort ?? 0,
        system: {
            ability: {
                value: (!proficiencySlug && attribute) || "",
            },
            prepared: {
                value: category ?? "innate",
            },
            showSlotlessLevels: {
                value: showSlotlessRanks ?? false,
            },
            proficiency: {
                value: proficiencyRank ?? 1,
                slug: proficiencySlug ?? "",
            },
            tradition: {
                value: tradition ?? "arcane",
            },
        },
        flags: flags ?? {},
    };
}
exports.createSpellcastingSource = createSpellcastingSource;
