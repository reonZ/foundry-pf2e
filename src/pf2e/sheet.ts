function createTagifyTraits(
    traits: Iterable<string>,
    { sourceTraits, record }: TagifyTraitOptions
): TagifyTrait[] {
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

type TagifyTrait = { id: string; value: string; readonly: boolean };

export type { TagifyTrait };
export { createTagifyTraits };
