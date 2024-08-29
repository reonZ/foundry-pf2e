"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompendiumFilters = exports.filterTraits = void 0;
function filterTraits(traits, selected, condition) {
    const selectedTraits = selected.filter((s) => !s.not).map((s) => s.value);
    const notTraits = selected.filter((t) => t.not).map((s) => s.value);
    if (selectedTraits.length || notTraits.length) {
        if (notTraits.some((t) => traits.includes(t))) {
            return false;
        }
        const fullfilled = condition === "and"
            ? selectedTraits.every((t) => traits.includes(t))
            : selectedTraits.some((t) => traits.includes(t));
        if (!fullfilled)
            return false;
    }
    return true;
}
exports.filterTraits = filterTraits;
async function getCompendiumFilters(tab, init) {
    const compendiumTab = game.pf2e.compendiumBrowser.tabs[tab];
    return init
        ? await compendiumTab.getFilterData()
        : compendiumTab.isInitialized
            ? foundry.utils.deepClone(compendiumTab.defaultFilterData)
            : foundry.utils.deepClone(compendiumTab.filterData);
}
exports.getCompendiumFilters = getCompendiumFilters;
