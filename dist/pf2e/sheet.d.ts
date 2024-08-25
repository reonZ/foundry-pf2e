declare function createTagifyTraits(traits: Iterable<string>, { sourceTraits, record }: TagifyTraitOptions): TagifyTrait[];
type TagifyTrait = {
    id: string;
    value: string;
    readonly: boolean;
};
export type { TagifyTrait };
export { createTagifyTraits };
