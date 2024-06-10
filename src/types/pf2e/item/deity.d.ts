export {};

declare global {
    type Sanctification = "holy" | "unholy";
    type DeityDomain = string;

    type DeitySource = BaseItemSourcePF2e<"deity", DeitySystemSource>;

    type DeitySystemSource = ItemSystemSource & {
        category: "deity" | "pantheon" | "philosophy";
        sanctification: DeitySanctification | null;
        domains: {
            primary: DeityDomain[];
            alternate: DeityDomain[];
        };
        font: DivineFonts;
        attribute: AttributeString[];
        skill: SkillSlug[] | null;
        weapons: BaseWeaponType[];
        spells: Record<number, ItemUUID>;
        level?: never;
        traits: OtherTagsOnly;
    };

    type DeitySanctification = { modal: "can" | "must"; what: Sanctification[] };

    type DivineFonts = ["harm"] | ["heal"] | ["harm", "heal"] | never[];

    interface DeitySystemData
        extends Omit<DeitySystemSource, "description">,
            Omit<ItemSystemData, "level" | "traits"> {}

    class DeityPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends ItemPF2e<TParent> {}

    interface DeityPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent> {
        readonly _source: DeitySource;
        system: DeitySystemData;
    }
}
