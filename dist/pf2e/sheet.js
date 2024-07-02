"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTagifyTraits = void 0;
function createTagifyTraits(traits, { sourceTraits, record }) {
    const sourceSet = new Set(sourceTraits ?? traits);
    const traitSlugs = [...traits];
    const readonlyTraits = traitSlugs.filter((t) => !sourceSet.has(t));
    return traitSlugs
        .map((slug) => {
        const label = game.i18n.localize(record?.[slug] ?? slug);
        return { id: slug, value: label, readonly: readonlyTraits.includes(slug) };
    })
        .sort((t1, t2) => t1.value.localeCompare(t2.value));
}
exports.createTagifyTraits = createTagifyTraits;
