declare function createTagifyTraits(traits: Iterable<string>, { sourceTraits, record }: TagifyTraitOptions): {
    id: string;
    value: string;
    readonly: boolean;
}[];
export { createTagifyTraits };
